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
import { UseGuards } from '@nestjs/common';
import { UserService } from 'src/user.service';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';

@UseGuards(Gateway2faGuard)
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService,
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
    console.log('[GameGateway] rejoin', userInfo.gameRoom);
    client.join(userInfo.gameRoom);
    console.log('[GameGateway] reconnect', userInfo.gameRoom);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('[GameGateway] Disconnection', client.id);
    if (!this.userService.checkPnJwt(client)) return ;
    //
    const intraId = this.userService.getIntraId(client.id);
    if (!intraId) return ;
    const userInfo = this.userService.getUserInfo(intraId);
    if (!userInfo) return ;
    if (!userInfo.gameRoom) {
      console.log('[INFO] 게임 방이 없습니다.');
      this.gameService.removeMatchingClient(client);
      return ;
    }
    const gameInfo = this.gameService.getGameInfo(userInfo.gameRoom);
    if (!gameInfo) {
      this.userService.deleteGameRoom(intraId);
      return ;
    }
    this.server.to(userInfo.gameRoom).emit('game-disconnect', {
      disconnectNickname: userInfo.nickname,
      gameInfo
    });
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

  @SubscribeMessage('game-start')
  handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() payload: any, @PnJwtPayload() pnPayload: PnPayloadDto) {
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
    const roomName = this.gameService.getGameRoom(client);
    const gameInfo = this.gameService.getGameInfo(roomName);
    if (!gameInfo) return ;

    if (this.gameService.isReadyScoreCheck(gameInfo, payload.playerNumber, payload.score)) {
      const winnerNickname = this.gameService.checkCorrectScoreWhoWinner(gameInfo);
      console.log('INFO: 승자 발견', winnerNickname);
      gameInfo.score = winnerNickname === '' ? gameInfo.score : gameInfo.waitList[0].score;
      this.server.to(roomName).emit('game-score', { realScore: gameInfo.score, winnerNickname });
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
