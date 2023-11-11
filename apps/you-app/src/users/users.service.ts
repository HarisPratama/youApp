import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { User } from '../schemas/user.schema';
import { ChineseZodiacSign, ZodiacSign, zodiacDateRanges } from '../constant';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  zodiacSigns: ZodiacSign[] = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ];

  async create(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async findUserById(id: string): Promise<User> {
    return this.userModel
      .findById(new Types.ObjectId(id))
      .select({ password: 0 });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).select({ password: 0 });
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userModel
      .findOne({ username: username })
      .select({ password: 0 });
  }

  async findUserByEmailOrUsername(email: string) {
    return this.userModel.findOne({ $or: [{ email }, { username: email }] });
  }

  async updateProfile(createUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      {
        email: createUserDto.email,
        _id: createUserDto._id,
      },
      createUserDto,
    );
  }

  calculateHoroscope(birthDate: Date) {
    const month = birthDate.getMonth() + 1; // Months are zero-indexed in JavaScript, so add 1
    const day = birthDate.getDate();

    let horoscope: ZodiacSign = 'Aquarius';
    const zodiac = this.calculateChineseZodiac(birthDate);

    for (const sign of this.zodiacSigns) {
      const dateRange = zodiacDateRanges[sign];
      if (
        (month === dateRange.startMonth && day >= dateRange.startDay) ||
        (month === dateRange.endMonth && day <= dateRange.endDay) ||
        (month > dateRange.startMonth && month < dateRange.endMonth)
      ) {
        horoscope = sign;
        break;
      }
    }

    return {
      zodiac,
      horoscope,
    };
  }

  calculateChineseZodiac(dob: Date) {
    const startYear = 1912; // Replace with the starting year of your data
    const currentYear = new Date().getFullYear();
    const chineseZodiacData: {
      start: Date;
      end: Date;
      sign: ChineseZodiacSign;
    }[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      const start = new Date(`${year}-01-25`);
      const end = new Date(`${year + 1}-02-09`);
      const sign = this.calculateChineseZodiacSign(year);
      chineseZodiacData.push({ start, end, sign });
    }

    let chineseZodiac: ChineseZodiacSign = 'Boar';

    for (const entry of chineseZodiacData) {
      if (dob >= entry.start && dob <= entry.end) {
        chineseZodiac = entry.sign;
        break;
      }
    }

    return chineseZodiac;
  }

  calculateChineseZodiacSign(year: number) {
    const signs: ChineseZodiacSign[] = [
      'Rat',
      'Ox',
      'Tiger',
      'Rabbit',
      'Dragon',
      'Snake',
      'Horse',
      'Goat',
      'Monkey',
      'Rooster',
      'Dog',
      'Boar',
    ];

    const index = (year - 1912) % 12;
    return signs[index];
  }
}
