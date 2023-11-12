import {
  Controller,
  Get,
  Inject,
  Request,
  UseGuards,
  Res,
  HttpStatus,
  Body,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../auth/auth.guard';
import { CreateMessageDto, GetmessagesDto } from '../../dto/chat.dto';
import { UsersService } from '../../users/users.service';
import { SocketGateway } from '../../socket/shocket.gateway';

@Controller('api')
export class ChatController {
  constructor(
    @Inject('CHAT_SERVICE') private clienChatService: ClientProxy,
    private userService: UsersService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @UseGuards(AuthGuard)
  @Get('viewMessages')
  getMessages(@Request() req, @Res() res: Response) {
    const chatResponse = this.clienChatService.send('get_messages', req.user);

    chatResponse.subscribe((resp) => {
      res.status(HttpStatus.OK).json({ status: 'Success', data: resp });
    });
  }

  @UseGuards(AuthGuard)
  @Get('viewDetailsMessage')
  async getDetailsMessage(
    @Request() req,
    @Body() body: GetmessagesDto,
    @Res() res: Response,
  ) {
    try {
      const data = {
        senderId: req.user._id,
        receiverId: body.receiverId,
      };
      const findReceiver = await this.userService.findUserById(body.receiverId);

      // if (!findReceiver) throw Error;

      const chatResponse = this.clienChatService.send(
        'get_details_message',
        data,
      );

      chatResponse.subscribe((resp) => {
        res.status(HttpStatus.OK).json({
          status: 'Success',
          statusCode: resp.status,
          data: {
            user: findReceiver,
            messages: resp.data,
          },
        });
      });
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'Success', data: error });
    }
  }

  @UseGuards(AuthGuard)
  @Post('sendMessages')
  async createMessages(@Request() req, @Body() body, @Res() res: Response) {
    const { receiverId, message } = body;

    const data: CreateMessageDto = {
      messageId: `${req.user._id}-${receiverId}`,
      message,
      createdAt: new Date(),
      senderId: req.user._id,
      receiverId,
    };
    const findReceiver = await this.userService.findUserById(data.receiverId);
    const chatResponse = this.clienChatService.send('send_chat', data);

    chatResponse.subscribe((resp) => {
      if (findReceiver.clientId)
        this.socketGateway.server
          .to(findReceiver.clientId)
          .emit('viewDetailsMessage', {
            status: 'Success',
            statusCode: resp.status,
            data: {
              user: findReceiver,
              messages: [data],
              clientId: findReceiver.clientId,
            },
          });

      res.status(HttpStatus.OK).json({ status: 'Success', data: resp });
    });
  }
}
