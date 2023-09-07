import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/datasource';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
import { ChannelModule } from './channel/channel.module';
import { UserService } from './user.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [ConfigModule.forRoot(), GameModule, AuthModule, DatabaseModule, ChatModule, ChannelModule, ProfileModule],
  controllers: [AppController, ProfileController],
  providers: [AppService, AppGateway, UserService, ProfileService],
})

export class AppModule { }
