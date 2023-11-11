import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('createProfile')
  async createProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const payload: UpdateUserDto = {
      ...updateUserDto,
      birthDate: new Date(updateUserDto.birthDate),
      ...req.user,
    };

    const { horoscope, zodiac } = this.userService.calculateHoroscope(
      payload.birthDate,
    );

    payload.horoScope = horoscope;
    payload.zodiac = zodiac;

    const updateProfile = await this.userService.updateProfile(payload);

    if (updateProfile.email)
      res.status(HttpStatus.CREATED).json({ status: 'Success', data: payload });
    else res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
  }

  @UseGuards(AuthGuard)
  @Get('getProfile')
  async getProfile(@Request() req, @Res() res: Response) {
    try {
      const getUserProfile = await this.userService.findUserByEmailOrUsername(
        req.user.email ?? req.user.username,
      );

      if (getUserProfile.email) {
        res
          .status(HttpStatus.OK)
          .json({ status: 'Success', data: getUserProfile });
      } else {
        throw Error;
      }
    } catch {
      res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
    }
  }

  @UseGuards(AuthGuard)
  @Post('updateProfile')
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const payload = {
      ...updateUserDto,
      birthDate: new Date(updateUserDto.birthDate),
      ...req.user,
    };

    const { horoscope, zodiac } = this.userService.calculateHoroscope(
      payload.birthDate,
    );

    payload.horoScope = horoscope;
    payload.zodiac = zodiac;

    const updateProfile = await this.userService.updateProfile(payload);

    if (updateProfile.email)
      res.status(HttpStatus.CREATED).json({ status: 'Success', data: payload });
    else res.status(HttpStatus.BAD_GATEWAY).json({ status: 'Error' });
  }
}
