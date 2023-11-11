import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ required: true })
  messageId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, ref: 'User' })
  senderId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  receiverId: MongooseSchema.Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
