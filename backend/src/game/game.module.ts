import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entity/Game';

@Module({
  imports: [TypeOrmModule.forFeature([ Game ])],
  providers: [GameService, GameGateway],
})
export class GameModule {}
