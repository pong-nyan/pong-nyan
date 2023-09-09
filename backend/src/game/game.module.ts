import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entity/Game';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Game ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d'}
    }),
  ],
  providers: [GameService, GameGateway, UserService],
})
export class GameModule {}
