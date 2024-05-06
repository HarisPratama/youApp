import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HashingService } from './helpers/hashing/hashing.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ChatController } from './services/chat/chat.controller';
import { SocketGateway } from './socket/shocket.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { AuthService } from './auth/auth.service';
// import { ConfigService } from 'nest-shared';
// import { ConfigService } from './services/config/config.service';

const dbcloud =
  'mongodb+srv://haris:3ynawF1zbEPR74IK@cluster0.r8pel.mongodb.net/youapp?retryWrites=true&w=majority&appName=Cluster0';

// const dblocal = 'mongodb://localhost:27017/youapp';

@Module({
  imports: [
    MongooseModule.forRoot(dbcloud),
    AuthModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AppController, ChatController],
  providers: [
    AppService,
    AuthService,
    HashingService,
    JwtService,
    SocketGateway,
    {
      provide: 'CHAT_SERVICE',
      useFactory: () => {
        // const mathSvcOptions = configService.get('chatService');
        return ClientProxyFactory.create({
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
        });
      },
      inject: [],
    },
  ],
})
export class AppModule {}
