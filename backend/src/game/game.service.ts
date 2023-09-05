import { Injectable } from '@nestjs/common';
import { Game } from 'src/entity/Game';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { BallInfo, GameInfo, RoomName } from 'src/type/game';

@Injectable()
export class GameService {
    // TODO: matchingQueue 확인해야함
    matchingQueue: Socket[] = [];
    // TODO: 적절하게  recentBallInfo 메모리 관리해야함.
    // IDEA: 게임이 끝나면 삭제하는 방법
    recentBallInfoMap = new Map<RoomName, BallInfo>();
    gameMap = new Map<RoomName, GameInfo>();

    constructor(@InjectRepository(Game) private readonly gameRepository: Repository) { }
    match(client: Socket) {
        this.matchingQueue.push(client);

        if (this.matchingQueue.length > 1) {
            const prefix = 'game-';
            const player1 = this.matchingQueue.shift();
            const player2 = this.matchingQueue.shift();
            const roomName = prefix + player1.id + '-' + player2.id;
            player1.join(roomName);
            player2.join(roomName);
            const p1 = player1.id;
            const p2 = player2.id;
            this.gameMap.set(roomName, { roomName, p1, p2, score: { p1: 0, p2: 0 } });
            return { roomName, p1, p2 };
        }
        return undefined;
    }

    getGameRoom(client: Socket) {
        let roomName = '';
        for (const value of client.rooms) {
          if (value.startsWith('game-'))
            {
              roomName = value;
              break;
            }
        }
        if (roomName === '') return;
        return roomName;
    }

    reconcilateBallInfo(roomName: RoomName, ballInfo: BallInfo) : BallInfo | undefined {
        const recentBallInfo = this.recentBallInfoMap.get(roomName);
        // TODO: 적절한 acceptableDiff를 찾아야 함
        const accepableDiff = 0.1;
        if (!recentBallInfo) {
            this.recentBallInfoMap.set(roomName, ballInfo);
            return undefined;
        }
        const diffX = Math.abs(ballInfo.position.x - recentBallInfo.position.x);
        const diffY = Math.abs(ballInfo.position.y - recentBallInfo.position.y);
        const diffVx = Math.abs(ballInfo.velocity.x - recentBallInfo.velocity.x);
        const diffVy = Math.abs(ballInfo.velocity.y - recentBallInfo.velocity.y);
        if (diffX > accepableDiff || diffY > accepableDiff || diffVx > accepableDiff || diffVy > accepableDiff) {
            this.recentBallInfoMap.set(roomName, ballInfo);
            return ballInfo;
        }
        return undefined;
    }

    removeMatchingClient(client: Socket) {
        this.matchingQueue = this.matchingQueue.filter(item => item !== client);
        console.log(this.matchingQueue.length);
    }

    async addGameInfo(winner: number, loser: number, gameMode: number, rankScore: number, gameInfo: JSON) {
        await this.historyRepository.insert({ winner, loser, gameMode, rankScore, gameInfo });
    }

    async getMyGameInfo(intraId: number) {
        if (!intraId) return null;
        return await this.historyRepository.find({ where: [{ winner: intraId }, { loser: intraId }] });
    }
}


