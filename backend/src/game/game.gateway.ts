import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { BallInfo, PlayerNumber, Score, GameInfo } from 'src/type/gameType';
import { GameApiService } from './game.api.service';
import { UseGuards } from '@nestjs/common';
import { UserService } from 'src/user.service';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';
import { GameStatus } from 'src/type/gameType';


@UseGuards(Gateway2faGuard)
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService,
              private readonly gameApiService: GameApiService,
              private readonly userService: UserService) {}

  @WebSocketServer() server: Server;
  fps = 1000 / 60;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('[GameGateway] Connection', client.id);
    if (!this.userService.checkPnJwt(client)) return ;
    console.log('[GameGateway] have a pnJwt', client.id);
    const intraId = this.userService.getIntraId(client.id);
    if (!intraId) return ;
    const userInfo = this.userService.getUserInfo(intraId);
    console.log('[GameGateway] userInfo', userInfo);
    if (!userInfo || userInfo.gameRoom === '') return ;
    console.log('[GameGateway] have a userInfo', client.id);
    const gameInfo = this.gameService.getGameInfo(userInfo.gameRoom);
    if (!gameInfo) return ;
    client.join(userInfo.gameRoom);
    console.log('[GameGateway] reconnect', userInfo.gameRoom);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('[GameGateway] Disconnection', client.id);

    if (!this.userService.checkPnJwt(client)) return ;
    console.log('[GameGateway] have pnJwt', client.id);

    const intraId = this.userService.getIntraId(client.id);
    if (!intraId) return ;

    const userInfo = this.userService.getUserInfo(intraId);
    if (!userInfo ) return ;
    console.log('[GameGateway] have userInfo', userInfo);

    this.gameService.removeMatchingClient(client);
    if (userInfo.gameRoom === '') return ;
    console.log('[GameGateway] is in gameRoom', userInfo.gameRoom);

    const gameInfo = this.gameService.getGameInfo(userInfo.gameRoom);
    if (!gameInfo) return ;
    console.log('[GameGateway] emit gameInfo', client.id);
    this.server.to(userInfo.gameRoom).emit('game-disconnect', {
      disconnectNickname: userInfo.nickname,
      gameInfo
    });
    this.userService.deleteGameRoom(intraId);
  }

  // @SubscribeMessage('game-randomStart-normal-orign')
  // handleStartNormalOrign(@ConnectedSocket() client: Socket, @MessageBody() payload: any, @PnJwtPayload() pnPayload: PnPayloadDto) {
  //   this.handleStartGame();
  // }
  // @SubscribeMessage('game-randomStart-normal-pn')
  // handleStartNormalPn(@ConnectedSocket() client: Socket, @MessageBody() payload: any, @PnJwtPayload() pnPayload: PnPayloadDto) {
  //   this.handleStartGame();
  // }
  //
  // @SubscribeMessage('game-randomStart-rank-orign')
  // handleStartRankOrign(@ConnectedSocket() client: Socket, @MessageBody() payload: any, @PnJwtPayload() pnPayload: PnPayloadDto) {
  //   this.handleStartGame();
  // }
  //

  @SubscribeMessage('game-friendStart')
  handleFriendStart(@ConnectedSocket() client: Socket, @MessageBody() data: any, @PnJwtPayload() payload: PnPayloadDto) {
    const userInfo = this.userService.getUserInfo(payload.intraId);
    if (!userInfo) return ;
    console.log('data', data);
    console.log('friendNickname', data.friendNickname);
    console.log('nickname', payload.nickname);
    const [ roomName, player1Id, player2Id ] = this.gameService.friendMatch(client, payload.nickname, data.friendNickname);
    if (!roomName) this.server.to(client.id).emit('game-loading');
    if (!player1Id || !player2Id) return;
    this.server.to(roomName).emit('game-friendStart', {player1Id, player2Id});
  }

  @SubscribeMessage('game-start')
  handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() payload: { gameStatus: GameStatus }, @PnJwtPayload() pnPayload: PnPayloadDto) {
    console.log('[Game Gateway] game-start');
    const [ roomName, player1Id, player2Id ] =
      this.gameService.match(client, payload.gameStatus - 1, pnPayload.intraId, pnPayload.nickname);
    if (!roomName) this.server.to(client.id).emit('game-loading');
    if (!player1Id || !player2Id) return;
    this.server.to(roomName).emit('game-start', {roomName, player1Id, player2Id});
  }

  @SubscribeMessage('game-keyEvent')
  handleGameKeyEvent(@ConnectedSocket() client: Socket, @MessageBody() payload: any, @PnJwtPayload() pnPayload: PnPayloadDto) {
    const roomName = this.gameService.getGameRoom(client);
    console.log('roomName', this.gameService.getGameInfo(roomName));
    this.server.to(payload.opponentId).emit('game-keyEvent', {
      opponentNumber: payload.playerNumber,
      message: payload.message,
      step: payload.step,
      velocity: payload.velocity
    });
  }

  // TODO: sensor에 닿을 시 score 변경
  @SubscribeMessage('game-score')
  handleScore(@ConnectedSocket() client: Socket, @MessageBody() payload: {playerNumber: PlayerNumber, score: Score}, @PnJwtPayload() pnPayload: PnPayloadDto) {
    console.log('[Game Gateway] game-score');
    console.log('payload', client.rooms);
    const roomName = this.gameService.getGameRoom(client);
    console.log('roomName', roomName);
    const gameInfo = this.gameService.getGameInfo(roomName);
    console.log('gameInfo', gameInfo);
    if (!gameInfo) return ;


    if (this.gameService.isReadyScoreCheck(gameInfo, payload.playerNumber, payload.score)) {
      const winnerNickname = this.gameService.checkCorrectScoreWhoWinner(gameInfo);
      console.log('INFO: 승자 발견', winnerNickname);
      gameInfo.score = winnerNickname === '' ? gameInfo.score : gameInfo.waitList[0].score;

      if (gameInfo.score.p1 < 5 && gameInfo.score.p2 < 5) {
        console.log('INFO: 게임 스코어');
        this.server.to(roomName).emit('game-score', { realScore: gameInfo.score, winnerNickname });
      }
      else { /* 5점 이상일 때 */
        // DB에 저장
        console.log('INFO: DB에 저장');
        if (gameInfo.gameStatus === GameStatus.RankPnRun || gameInfo.gameStatus === GameStatus.RankOriginRun) {
            // 랭킹에 저장
            console.log('INFO: 랭킹 업데이트');
        }
      }
      this.server.to(roomName).emit('game-end');
      gameInfo.waitList = [];
    }
  }

  @SubscribeMessage('game-ball')
  handleBall(@ConnectedSocket() client: Socket, @MessageBody() ball: BallInfo) {
    const roomName = this.gameService.getGameRoom(client);
    const updatedBallInfo = this.gameService.reconcilateBallInfo(roomName, ball);
    if (!updatedBallInfo) return;
    this.server.to(roomName).emit('game-ball', updatedBallInfo);
  }
}

  // @SubscribeMessage('game-disconnect')
  // handleDisconnect(@ConnectedSocket() client: Socket, @PnJwtPayload() pnPayload: PnPayloadDto) {
  //
  // }
