import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './datasource';

@Module({
  imports: [ConfigModule.forRoot(), GameModule, AuthModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
