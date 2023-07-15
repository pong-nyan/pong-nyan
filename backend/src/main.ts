import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  TODO : port should be in config
  await app.listen(4242);
  console.log('🚀 Server ready at: http://localhost:4242');
}
bootstrap();
