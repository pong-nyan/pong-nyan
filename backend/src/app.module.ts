import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/datasource';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
import { ChannelModule } from './chat/channel.module';
import { UserService } from './user.service';
import { RankModule } from './rank/rank.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [ConfigModule.forRoot(), GameModule, AuthModule, DatabaseModule, ChatModule, ChannelModule, RankModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, UserService],
})

export class AppModule { }
