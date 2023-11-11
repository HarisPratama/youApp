import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HashingService } from './helpers/hashing/hashing.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ChatController } from './services/chat/chat.controller';
// import { ConfigService } from 'nest-shared';
// import { ConfigService } from './services/config/config.service';

const dbcloud =
  'mongodb+srv://haris:F754oGsUHPVKgEEt@cluster0.r8pel.mongodb.net/youapp?retryWrites=true&w=majority';

// const dblocal = 'mongodb://localhost:27017/youapp';

@Module({
  imports: [MongooseModule.forRoot(dbcloud), AuthModule, UsersModule],
  controllers: [AppController, ChatController],
  providers: [
    AppService,
    HashingService,
    {
      provide: 'CHAT_SERVICE',
      useFactory: () => {
        // const mathSvcOptions = configService.get('chatService');
        return ClientProxyFactory.create({
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
        });
      },
      inject: [],
    },
  ],
})
export class AppModule {}
