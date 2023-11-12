import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { Chat } from './schemas/messages.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  getMessages(loggedInUserId: string) {
    return this.chatModel.aggregate([
      {
        $match: {
          $or: [
            { senderId: new Types.ObjectId(loggedInUserId) },
            { receiverId: new Types.ObjectId(loggedInUserId) },
          ],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$senderId', new Types.ObjectId(loggedInUserId)] },
              then: '$receiverId',
              else: '$senderId',
            },
          },
          messages: {
            $push: {
              _id: '$_id',
              messageId: '$messageId',
              message: '$message',
              senderId: '$senderId',
              receiverId: '$receiverId',
              createdAt: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users', // Replace with the actual name of the User collection
          // localField: '_id',
          // foreignField: '_id',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$userId'] },
              },
            },
            {
              $project: {
                password: 0,
                email: 0,
                username: 0,
                profileImage: 0,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $sort: {
          'messages.createdAt': -1, // Sort messages by createdAt in ascending order
        },
      },
      {
        $project: {
          _id: '$_id',
          user: 1,
          messages: { $slice: ['$messages', 1] }, // Limit the messages per chat
          count: 1,
        },
      },
    ]);
  }

  getMessagesById(senderId: string, receiverId: string) {
    return this.chatModel
      .find({
        $or: [
          { messageId: `${senderId}-${receiverId}` },
          { messageId: `${receiverId}-${senderId}` },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(11);
  }

  async create(createUserDto: CreateMessageDto) {
    const createUser = new this.chatModel(createUserDto);
    return createUser.save();
  }
}
