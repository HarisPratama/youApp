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
          'amqps://fiviwfpt:C041g_gFLrSUmYA4tSh-xlss1QSiH_FH@jackal.rmq.cloudamqp.com/fiviwfpt',
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
