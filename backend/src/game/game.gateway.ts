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
import { BallInfo, PlayerNumber, Score } from 'src/type/gameType';
import { UseGuards } from '@nestjs/common';
import { UserService } from 'src/user.service';
import { PnJwtPayload, PnPayloadDto } from './game.dto';
import { GatewayGuard } from 'src/context/gateway.guard';

@UseGuards(GatewayGuard)
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

    const intraId = this.userService.getIntraId(client.id);
    const userInfo = this.userService.getUserInfo(intraId);
    if (!userInfo || !userInfo.gameRoom) return ;
    const gameInfo = this.gameService.getGameInfo(userInfo.gameRoom);
    if (!gameInfo) return ;
    client.join(userInfo.gameRoom);
    // this.server.to(userInfo.gameRoom).emit('game-reconnect', { gameInfo.gameStatus });
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('[INFO] handleDisconnect :', );
    //
    const intraId = this.userService.getIntraId(client.id);
    const userInfo = this.userService.getUserInfo(intraId);
    if (!userInfo.gameRoom) {
      console.log('[INFO] 게임 방이 없습니다.');
      this.gameService.removeMatchingClient(client);
      return ;
    }
    const gameInfo = this.gameService.getGameInfo(userInfo.gameRoom);
    if (!gameInfo) {
      this.userService.leaveGameRoom(intraId);
      return ;
    }
    this.server.to(userInfo.gameRoom).emit('game-disconnect', {
      disconnectNickname: userInfo.nickname,
      gameInfo
    });
  }

  // @SubscribeMessage('game-randomStart-rank-pn')
  // handleStartGame(@MessageBody() data: any, @ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
  //   const userInfo = this.userService.getUser(payload.intraId);
  //   if (!userInfo) return ;
  //   const [ roomName, player1Id, player2Id ] = this.gameService.match(client, payload.nickname);
  // }

  @SubscribeMessage('game-start')
  handleStartGame(@ConnectedSocket() client: Socket, @MessageBody() data: any, @PnJwtPayload() payload: PnPayloadDto) {
    const userInfo = this.userService.getUserInfo(payload.intraId);
    if (!userInfo) return ;

    const [ roomName, player1Id, player2Id ] = this.gameService.match(client, 0, payload.nickname);
    if (!roomName) this.server.to(client.id).emit('game-loading');
    if (!player1Id || !player2Id) return;
    this.server.to(roomName).emit('game-randomStart-rank-pn', {player1Id, player2Id});
  }

  @SubscribeMessage('game-keyEvent')
  handleGameKeyEvent(@ConnectedSocket() client: Socket, @MessageBody() data: any, @PnJwtPayload() payload: PnPayloadDto) {
    const roomName = this.gameService.getGameRoom(client);
    console.log('roomName', roomName);
    this.server.to(data.opponentId).emit('game-keyEvent', {
      opponentNumber: data.playerNumber,
      message: data.message,
      step: data.step,
      velocity: data.velocity
    });
  }

  // TODO: sensor에 닿을 시 score 변경
  @SubscribeMessage('game-score')
  handleScore(@ConnectedSocket() client: Socket, @MessageBody() data: {playerNumber: PlayerNumber, score: Score}, @PnJwtPayload() payload: PnPayloadDto) {
    const roomName = this.gameService.getGameRoom(client);
    const gameInfo = this.gameService.getGameInfo(roomName);
    if (!gameInfo) return ;

    if (this.gameService.isReadyScoreCheck(gameInfo, data.playerNumber, data.score)) {
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
  // handleDisconnect(@ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
  //
  // }
