import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entity/Game';
import { User } from 'src/entity/User';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user.service';
import { UserModule } from 'src/user.module';
import { GameApiService } from './game.api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Game, User ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d'}
    }),
    UserModule],
  providers: [GameService, GameApiService, GameGateway, UserService],
})
export class GameModule {}
