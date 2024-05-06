import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/messages.schema';

const dbcloud =
  'mongodb+srv://haris:3ynawF1zbEPR74IK@cluster0.r8pel.mongodb.net/youapp?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [
    MongooseModule.forRoot(dbcloud),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqp://guest:guest@13.215.190.90:5672',
            // 'amqps://ynvyudss:NplTt26iNlrD9BJadzgZJkR3Akqirftn@armadillo.rmq.cloudamqp.com/ynvyudss',
          ],
          queue: 'chat_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
