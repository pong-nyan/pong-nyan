import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as express from 'express';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('../secrets/cert.key'),
    cert: fs.readFileSync('../secrets/cert.crt'),
  };

  const server = express();
  const app = await NestFactory.create(AppModule, { httpsOptions });
  //  TODO : port should be in config
  app.enableCors(
    {
      'origin': '*',
      'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'preflightContinue': false,
      'optionsSuccessStatus': 204,
      'credentials': true,
    }
  );
  app.use(cookieParser());
  app.use(server);

  await app.listen(4242);

  console.log('🚀 Server ready at: https://localhost:4242');
}

bootstrap();
