import { Injectable } from '@nestjs/common';
import { Game } from 'src/entity/Game';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Socket, RoomName, SocketId } from 'src/type/socketType';
import { BallInfo, GameInfo, PlayerNumber, GameStatus, MatchingQueue, FriendQueueInfo } from 'src/type/gameType';
import { IntraId, UserInfo, Nickname } from 'src/type/userType';
import { User } from 'src/entity/User';
import { UserService } from 'src/user.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) { }

  public getGameMap() { return this.gameMap; }

  public match(client: Socket, gameStatus: GameStatus, intraId: IntraId, nickname: string)
    : [ RoomName, SocketId, SocketId, GameStatus ] | [ undefined, undefined, undefined, undefined ] {
    const userInfo = this.userService.getUserInfo(intraId);
    if (!userInfo) return ;
    console.log('userInfo', userInfo);
    const gameStatusIndex = gameStatus - 1;
    this.matchingQueueList[gameStatusIndex].push({client, nickname, intraId});
    console.log('matchingQueue', this.matchingQueueList);
    // this.matchingQueue.push({client, nickname, intraId});
    if (this.matchingQueueList[gameStatusIndex].length > 1) {
      const player1 = this.matchingQueueList[gameStatusIndex].shift();
      const player2 = this.matchingQueueList[gameStatusIndex].shift();
      if (player1.nickname === player2.nickname) {
        this.matchingQueueList[gameStatusIndex].push(player1);
        return [ undefined, undefined, undefined, undefined ];
      }
      const roomName = uuidv4();
      const gameInfo = {
        gameStatus,
        clientId: { p1: player1.client.id, p2: player2.client.id },
        intraId: { p1: player1.intraId, p2: player2.intraId },
        score: { p1: 0, p2: 0 },
        nickname: { p1: player1.nickname, p2: player2.nickname },
        waitList: [],
        ballInfo: {
          position: { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
        },
      };
      const player1Id = player1.client.id;
      const player2Id = player2.client.id;
      this.gameMap.set(roomName, gameInfo);
      this.userService.setUserInfoGameRoom(roomName, gameInfo);
      console.log('gameMap', this.gameMap);
      return [ roomName, player1Id, player2Id, gameStatus ];
    }
    return [ undefined, undefined, undefined, undefined ];
  }

  public friendMatch(client: Socket, gameStatus: number, intraId: IntraId, nickname: string, friendNickname: string) {
    const friendIndex = this.findNicknameMatchingQueue(friendNickname);
    this.friendMatchingQueue.push({client, nickname, intraId, friendNickname});
    // 이미 친구가 매칭큐에 있고 그 친구가 신청한게 본인이면 매칭시켜줌
    if (friendIndex !== -1 && this.friendMatchingQueue[friendIndex].nickname === friendNickname) {
      const meIndex = this.findNicknameMatchingQueue(nickname);
      const player1 = this.friendMatchingQueue[friendIndex];
      const player2 = this.friendMatchingQueue[meIndex];
      // 매칭큐에서 두 유저 삭제
      this.friendMatchingQueue = this.friendMatchingQueue.filter(item => item.nickname !== nickname);
      this.friendMatchingQueue = this.friendMatchingQueue.filter(item => item.nickname !== friendNickname);
      const roomName = uuidv4();
      const gameInfo = {
        gameStatus,
        clientId: { p1: player1.client.id, p2: player2.client.id },
        intraId: { p1: player1.intraId, p2: player2.intraId },
        score: { p1: 0, p2: 0 },
        nickname: { p1: player1.nickname, p2: player2.nickname },
        waitList: [],
        ballInfo: {
          position: { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
        },
      };
      const player1Id = player1.client.id;
      const player2Id = player2.client.id;
      this.gameMap.set(roomName, gameInfo);
      this.userService.setUserInfoGameRoom(roomName, gameInfo);
      return [ roomName, player1Id, player2Id ];
    }
    return [ undefined, undefined, undefined ];
  }

  public getGameRoom(client: Socket) {
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

  public getGameInfo(roomName: RoomName): GameInfo {
    return this.gameMap.get(roomName);
  }

  public isReadyScoreCheck(gameInfo: GameInfo, playerNumber: PlayerNumber, score: { p1: number, p2: number}): boolean {
    if (!gameInfo.waitList.some(item => item.playerNumber === playerNumber)) {
      console.log('INFO: 점수 체크 준비', playerNumber, score);
      gameInfo.waitList.push({playerNumber, score: score});
    }
    if (gameInfo.waitList.length != 2) return false;
    console.log('INFO: 점수 이상 무 ', playerNumber, score);
    console.log('INFO: WTF gameInfo', gameInfo.waitList[0].score, gameInfo.waitList[1].score);
    return true;
  }

  public checkCorrectScoreWhoWinnerEnd(gameInfo: GameInfo): [ Nickname, IntraId, IntraId ] | [undefined, undefined, undefined] {
    console.log('INFO: 점수 체크 준비 완료', gameInfo.waitList);
    if ((gameInfo.waitList[0].score.p1 !== gameInfo.waitList[1].score.p1)
      || (gameInfo.waitList[0].score.p2 !== gameInfo.waitList[1].score.p2)) {
      return [ undefined, undefined, undefined ];
    }
    if (gameInfo.waitList[0].score.p1 - gameInfo.score.p1 === 1) {
      return [ gameInfo.nickname.p1, gameInfo.intraId.p1, gameInfo.intraId.p2 ];
    } else if (gameInfo.waitList[0].score.p2 - gameInfo.score.p2 === 1) {
      return [ gameInfo.nickname.p2, gameInfo.intraId.p2, gameInfo.intraId.p1 ];
    }
    return [ undefined, undefined, undefined ];
  }

  public reconcilateBallInfo(roomName: RoomName, ballInfo: BallInfo) : BallInfo | undefined {
    const recentBallInfo = this.recentBallInfoMap.get(roomName);
    const maxWidth = 300;
    const maxHeight = 500;
    const minWidth = 0;
    const minHeight = 0;
    const ballPosition = ballInfo?.position;
    if (!ballInfo || ballPosition?.x < minWidth || ballPosition?.x > maxWidth || ballPosition?.y < minHeight || ballPosition?.y > maxHeight) {
      return { position: { x: 150, y: 250 }, velocity: { x: 10, y: 10 }};
    }
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

  public removeMatchingClient(client: Socket) {
    console.log('before remove matchingQueue', this.matchingQueueList);
    this.matchingQueueList.forEach((matchingQueue, index) => {
      this.matchingQueueList[index] = matchingQueue.filter(item => item.client.id !== client.id);
    });
    console.log('after remove matchingQueue', this.matchingQueueList);
  }

  public async addGameInfo(winnerId: IntraId, loserId: IntraId, gameStatus: GameStatus, rankScore: number, gameInfo: GameInfo) {
    if (!winnerId || !loserId) return;
    const winnerUser = await this.userRepository.findOne( { where: { intraId: winnerId } });
    const loserUser = await this.userRepository.findOne({ where: { intraId: loserId } });
    if (!winnerUser || !loserUser) return;
    const gameMode = (gameStatus === GameStatus.RankPnRun || gameStatus === GameStatus.RankOriginRun) ? 1 : 0;
    if (gameMode) {
      winnerUser.rankScore += rankScore;
      loserUser.rankScore -= rankScore;
      await this.userRepository.update({ intraId: winnerId }, { rankScore: winnerUser.rankScore });
      await this.userRepository.update({ intraId: loserId }, { rankScore: loserUser.rankScore });
    }
    await this.gameRepository.save({ winner: winnerUser, loser: loserUser, gameMode, rankScore, gameInfo });
  }

  public async getMyGameInfo(intraId: number) {
    if (!intraId) return null;
    const user = await this.userRepository.findOne( { where: { intraId }, relations: ['winnerGames', 'loserGames'] } );
    if (!user) return null;
    const winnerGames = user.winnerGames;
    const loserGames = user.loserGames;
    return { winnerGames, loserGames };
  }

  public findGameRoomByNickname(nickname: string) {
    console.log('findGameRoomByNickname', this.gameMap.values());
    for (const gameInfo of this.gameMap.values()) {
      console.log('gameInfo', gameInfo);
      if (gameInfo.nickname.p1 && gameInfo.nickname.p2) {
        if (gameInfo.nickname.p1 === nickname || gameInfo.nickname.p2 === nickname) {
          return gameInfo;
        }
      }
    }
    return undefined;
  }

  public getWinnerLoserIdDisconnect(clientId: SocketId, gameInfo: GameInfo, )
      : [ IntraId, IntraId ] | [ undefined, undefined ] {
      const loserId = (clientId === gameInfo.clientId.p1) ? gameInfo.intraId.p1
                  : (clientId === gameInfo.clientId.p2) ? gameInfo.intraId.p2 : undefined;
    if (!loserId) return [ undefined, undefined ];
    const winnerId = (loserId === gameInfo.intraId.p1) ? gameInfo.intraId.p2 : gameInfo.intraId.p1;
    return [ winnerId, loserId ];
  }


  public deleteGameRoom(roomName: RoomName) {
    this.gameMap.delete(roomName);
  }

  /* -------------------------------------------------------------------- */

  private findNicknameMatchingQueue(friendNickname: string) {
    return this.friendMatchingQueue.findIndex(item => item.nickname === friendNickname);
  }

  private matchingQueueList: MatchingQueue[] = [[], [], [], []];
  private friendMatchingQueue: FriendQueueInfo[] = [];
  private recentBallInfoMap = new Map<RoomName, BallInfo>();
  private gameMap = new Map<RoomName, GameInfo>();
}
