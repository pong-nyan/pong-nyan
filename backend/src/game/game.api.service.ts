import { Injectable } from '@nestjs/common';
import { Game } from 'src/entity/Game';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/User';
import { GameModeEnum } from 'src/type/gameType';

@Injectable()
export class GameApiService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        private readonly userRepository: Repository<User>
    ) { }

    /*
    * @param winnerNickname winner's nickname
    * @param loserNickname loser's nickname
    * @param gameMode game mode, 0: normal, 1: ranked
    * @param gameInfo game info in JSON format
    */
    public async addGame(winnerNickname: string, loserNickname: string, gameMode: GameModeEnum, gameInfo: JSON) {
        const winner = await this.userRepository.findOne({ where: { nickname: winnerNickname} });
        const loser = await this.userRepository.findOne({ where: { nickname: loserNickname} });
        if (!winner || !loser) return null;
        const game = new Game();
        game.gameMode = gameMode;
        game.gameInfo = gameInfo;
        return await this.gameRepository.save(game);
    }
}