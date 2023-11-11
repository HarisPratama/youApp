import { Controller, Post, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { HashingService } from '../helpers/hashing/hashing.service';
import { UsersService } from '../users/users.service';

@Controller('api')
export class AuthController {
  constructor(
    private readonly hashingService: HashingService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Req() req: Request, @Res() res: Response) {
    const { email, password, username } = req.body;
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
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const { email, password } = req.body;

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
