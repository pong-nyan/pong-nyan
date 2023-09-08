import { Injectable } from '@nestjs/common';
import { Game } from 'src/entity/Game';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { BallInfo, GameInfo, QueueInfo, RoomName } from 'src/type/game';
import { User } from 'src/entity/User';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  // TODO: matchingQueue 확인해야함
  matchingQueue: QueueInfo[] = [];
  // TODO: 적절하게  recentBallInfo 메모리 관리해야함.
  // IDEA: 게임이 끝나면 삭제하는 방법
  recentBallInfoMap = new Map<RoomName, BallInfo>();
  gameMap = new Map<RoomName, GameInfo>();

  match(client: Socket, nickname: string) {
    this.matchingQueue.push({client, nickname});
    if (this.matchingQueue.length > 1) {
      const player1 = this.matchingQueue.shift();
      const player2 = this.matchingQueue.shift();
      const roomName = 'game-' + player1.nickname + ':' + player2.nickname;
      player1.client.join(roomName);
      player2.client.join(roomName);
      const player1Id = player1.client.id;
      const player2Id = player2.client.id;
      this.gameMap.set(roomName, {
        score: { p1: 0, p2: 0 },
        nickname: { p1: player1.nickname, p2: player2.nickname },
        waitList: [],
        ballInfo: {
          position: { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
        },
      });
      return [ roomName, player1Id, player2Id ];
    }
    return [ undefined, undefined, undefined ];
  }

  getGameRoom(client: Socket) {
    //refactor: for문을 사용하지 않고 찾는 방법
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

  getGameInfo(roomName: RoomName) {
    return this.gameMap.get(roomName);
  }

  isReadyScoreCheck(gameInfo: GameInfo, playerNumber: PlayerNumber, score: Score): boolean {
    if (!gameInfo.waitList.some(item => item.playerNumber === playerNumber)) {
      console.log('INFO: 점수 체크 준비', playerNumber, score);
      gameInfo.waitList.push({playerNumber, score: score});
    }
    if (gameInfo.waitList.length != 2) return false;
    return true;
  }

  checkCorrectScoreWhoWinner(gameInfo: GameInfo) {
    console.log('INFO: 점수 체크 준비 완료', gameInfo.waitList);
    if ((gameInfo.waitList[0].score.p1 !== gameInfo.waitList[1].score.p1)
        && (gameInfo.waitList[0].score.p2 !== gameInfo.waitList[1].score.p2)) { return ''; }
    return gameInfo.waitList[0].score.p1 - gameInfo.score.p1 === 1 ? gameInfo.nickname.p1
      : gameInfo.waitList[0].score.p2 - gameInfo.score.p2 === 1 ? gameInfo.nickname.p2 : '';
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
    this.matchingQueue = this.matchingQueue.filter(item => item.client.id !== client.id);
    console.log(this.matchingQueue.length);
  }

  async addGameInfo(winner: number, loser: number, gameMode: number, rankScore: number, gameInfo: JSON) {
    if (!winner || !loser) return;
    const winnerUser = await this.userRepository.findOne( { where: { intraId: winner } });
    const loserUser = await this.userRepository.findOne({ where: { intraId: loser } });
    if (!winnerUser || !loserUser) return;
    winnerUser.rankScore += rankScore;
    loserUser.rankScore -= rankScore;
    await this.userRepository.save(winnerUser);
    await this.userRepository.save(loserUser);
    await this.gameRepository.save({ winner: winnerUser, loser: loserUser, gameMode, rankScore, gameInfo });
  }

  async getMyGameInfo(intraId: number) {
      if (!intraId) return null;
      const user = await this.userRepository.findOne( { where: { intraId }, relations: ['winnerGames', 'loserGames'] } );
      if (!user) return null;
      const winnerGames = user.winnerGames;
      const loserGames = user.loserGames;
      return { winnerGames, loserGames };
    }

}

