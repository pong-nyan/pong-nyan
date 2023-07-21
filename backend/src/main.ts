import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  TODO : port should be in config
  app.enableCors(
    {
      'origin': '*',
      'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'preflightContinue': false,
      'optionsSuccessStatus': 204
    }
  )
  app.use(cookieParser());
  await app.listen(4242);
  console.log('🚀 Server ready at: http://localhost:4242');
}
bootstrap();
