import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  constructor(
    @Inject('CHAT_SERVICE') private clienChatService: ClientProxy,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { text: string }): void {
    // You can perform any logic here based on the received message
    // For example, you can emit a response to the same client or broadcast it to all clients
    this.server.emit('message', { text: `Server received: ${payload.text}` });
  }

  @SubscribeMessage('viewMessages')
  async handViewMessages(
    client: Socket,
    data: { token: string; loggedInUserId: string },
  ) {
    console.log(`viewMessages from client ${client.id}: ${data.token}`);

    const payload = await this.authService.verifyAccessToken(data.token);

    await this.userService.updateProfile({
      _id: data.loggedInUserId,
      email: payload.email,
      username: payload.username,
      clientId: client.id,
    });
    const chatResponse = this.clienChatService.send('get_messages', payload);

    chatResponse.subscribe((resp) => {
      this.server.emit('viewMessages', {
        status: 'Success',
        data: resp,
      });
    });
  }

  @SubscribeMessage('viewDetailsMessage')
  async handViewiewDetailsMessage(
    client: Socket,
    data: { receiverId: string; token: string },
  ) {
    console.log(`viewDetailsMessage from client ${client.id}: ${data.token}`);

    const payload = await this.authService.verifyAccessToken(data.token);
    const dataQuery = {
      senderId: payload._id,
      receiverId: data.receiverId,
    };
    const findReceiver = await this.userService.findUserById(data.receiverId);

    await this.userService.updateProfile({
      _id: data.receiverId,
      email: findReceiver.email,
      username: findReceiver.username,
      clientId: client.id,
    });
    const chatResponse = this.clienChatService.send(
      'get_details_message',
      dataQuery,
    );

    chatResponse.subscribe((resp) => {
      this.server.to(client.id).emit('viewDetailsMessage', {
        status: 'Success',
        statusCode: resp.status,
        data: {
          user: findReceiver,
          messages: resp.data,
          clientId: client.id,
        },
      });
    });
  }
}
