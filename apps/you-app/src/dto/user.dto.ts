export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  _id?: string;
  username?: string;
  email: string;
  gender: string;
  birthDate: Date;
  horoScope?: string;
  zodiac?: string;
  height: number;
  weight: number;
  interest?: string;
}

export class FindUserDto {
  name: string;
  email: string;
}
