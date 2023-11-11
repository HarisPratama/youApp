import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { amqpClientOptions } from './infra/microservices/amqp/amqp-client.options';
// import { PORT } from './shared/constants/global';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
