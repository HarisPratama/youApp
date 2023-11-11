import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/messages.schema';

const dbcloud =
  'mongodb+srv://haris:F754oGsUHPVKgEEt@cluster0.r8pel.mongodb.net/youapp?retryWrites=true&w=majority';

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
            'amqps://fiviwfpt:C041g_gFLrSUmYA4tSh-xlss1QSiH_FH@jackal.rmq.cloudamqp.com/fiviwfpt',
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
