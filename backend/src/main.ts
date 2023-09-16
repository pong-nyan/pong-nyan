import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { setupSwagger } from './config/swagger';
import { urlencoded, json } from 'body-parser';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    {
      'origin': ['http://localhost:3000', 'https://localhost'],
      'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'preflightContinue': false,
      'optionsSuccessStatus': 204,
      'credentials': true,
    }
  );
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(server);

  app.setGlobalPrefix('api');
  setupSwagger(app);
  await app.listen(4242);

  console.log(`🚀 Server ready at: ${ await app.getUrl()}`);
}

bootstrap();
