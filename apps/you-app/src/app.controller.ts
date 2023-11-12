import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SocketGateway } from './socket/shocket.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Get()
  getHello() {
    const messagePayload = { text: 'Hello from the server!' };
    this.socketGateway.server.emit('message', messagePayload);
    return {
      text: this.appService.getHello(),
      message: messagePayload,
    };
  }
}
