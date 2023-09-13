import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/datasource';
import { AppGateway } from './app.gateway';
import { ChatModule } from './chat/chat.module';
import { RankModule } from './rank/rank.module';
import { UserModule } from './user.module';
import { ProfileModule } from './profile/profile.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, DatabaseModule, ChatModule, GameModule, RankModule, UserModule, ProfileModule, FriendsModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})

export class AppModule { }
