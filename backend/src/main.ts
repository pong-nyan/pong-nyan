import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as express from 'express';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('../secrets/localhost.key'),
  //   cert: fs.readFileSync('../secrets/localhost.crt'),
  // };

  const server = express();
  const app = await NestFactory.create(AppModule);
  //  TODO : port should be in config
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
  setupSwagger(app);
  app.use(server);

  app.setGlobalPrefix('api');
  await app.listen(4242);

  console.log(`🚀 Server ready at: ${ await app.getUrl()}`);
}

bootstrap();
