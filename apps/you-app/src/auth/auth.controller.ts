import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { HashingService } from '../helpers/hashing/hashing.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Controller('api')
export class AuthController {
  constructor(
    private readonly hashingService: HashingService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      const { email, password, username } = body;
      const hashPass = await this.hashingService.encrypt(password);

      const findUserEmail = await this.userService.findUserByEmail(email);
      const findUserByUsername =
        await this.userService.findUserByUsername(username);

      if (
        (findUserEmail && findUserEmail.email) ||
        (findUserByUsername && findUserByUsername.username)
      ) {
        res.status(200).json({
          status: 'Error',
          message: 'User already registered',
        });
      } else {
        const FindUserDto = {
          email,
          password: hashPass,
          username,
        };

        const createUser = await this.userService.create(FindUserDto);
        res.status(201).json({
          status: 'Success',
          createUser,
        });
      }
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Error',
        message: error && error.message ? error.message : 'Bad Request',
      });
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { email, password } = body;

    const findUser = await this.userService.findUserByEmailOrUsername(email);

    if (findUser && findUser.email) {
      const comparePass = await this.hashingService.compare(
        password,
        findUser.password,
      );

      if (comparePass) {
        const payload = {
          email: findUser.email,
          username: findUser.username,
          _id: findUser._id,
        };

        const accessToken = await this.jwtService.signAsync(payload);
        res.status(200).json({
          status: 'Sukses',
          data: payload,
          accessToken,
        });
      } else {
        res.status(401).json({
          status: 'Unauthorized',
          message: 'Wrong password/email',
        });
      }
    } else {
      res.status(404).json({
        status: 'Not Found',
        message: 'User not found',
      });
    }
  }
}
