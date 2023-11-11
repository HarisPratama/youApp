import { Controller, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  // Ctx,
  MessagePattern,
  Payload,
  // RmqContext,
} from '@nestjs/microservices';
import { CreateMessageDto } from './dto/message.dto';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern('get_messages')
  async getMessages(@Payload() data) {
    try {
      const findMessages = await this.chatService.getMessages(data._id);
      return {
        status: HttpStatus.OK,
        message: 'success_get_chat',
        data: findMessages,
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error_get_chat',
        data: error,
      };
    }
  }

  @MessagePattern('get_details_message')
  async getDetailsMessage(@Payload() data) {
    try {
      const findMessages = await this.chatService.getMessagesById(
        data.senderId,
        data.receiverId,
      );
      return {
        status: HttpStatus.OK,
        message: 'success_get_chat',
        data: findMessages,
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error_get_chat',
        data: error,
      };
    }
  }

  @MessagePattern('send_chat')
  async createMessage(
    @Payload() data: CreateMessageDto,
    // @Ctx() context: RmqContext
  ) {
    try {
      const saveMessage = await this.chatService.create(data);
      return {
        status: HttpStatus.OK,
        message: 'success_send_chat',
        data: saveMessage,
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'error_send_chat',
        data: error,
      };
    }
  }
}
