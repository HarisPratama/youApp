import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  gender: string;

  @Prop({ default: Date.now() })
  birthDate: Date;

  @Prop({ default: '' })
  horoScope: string;

  @Prop({ default: '' })
  zodiac: string;

  @Prop({ default: 0 })
  height: number;

  @Prop({ default: 0 })
  weight: number;

  @Prop({ default: '' })
  interest: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
