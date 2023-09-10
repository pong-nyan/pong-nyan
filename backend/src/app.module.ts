import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/datasource';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
import { UserMapService } from './user.map.service';
import { ChannelModule } from './chat/channel.module';
import { RankModule } from './rank/rank.module';
import { UserModule } from './user.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [ConfigModule.forRoot(), GameModule, AuthModule, DatabaseModule, ChatModule, ChannelModule, RankModule, UserModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})

export class AppModule { }
