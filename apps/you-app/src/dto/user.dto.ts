import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Not required' })
  _id?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  profileImage?: File;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  birthDate?: Date;

  @ApiProperty()
  horoScope?: string;

  @ApiProperty()
  zodiac?: string;

  @ApiProperty()
  height?: number;

  @ApiProperty()
  weight?: number;

  @ApiProperty()
  interest?: string;

  @ApiProperty()
  clientId?: string;
}

export class FindUserDto {
  name: string;
  email: string;
}
