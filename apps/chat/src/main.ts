import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(ChatModule);
  // await app.listen(3001);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChatModule,
    {
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
  );
  await app.listen();
}
bootstrap();
