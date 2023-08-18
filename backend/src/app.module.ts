import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './datasource';
import { Google2faController } from './google2fa/google2fa.controller';
import { Google2faService } from './google2fa/google2fa.service';

@Module({
  imports: [GameModule, ConfigModule.forRoot(), AuthModule, DatabaseModule],
  controllers: [AppController, Google2faController],
  providers: [AppService, Google2faService],
})

export class AppModule { }
