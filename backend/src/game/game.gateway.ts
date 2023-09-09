import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { BallInfo, PlayerNumber, Score } from 'src/type/game';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { GameGuard } from './game.guard';
import { PnJwtPayload, PnPayloadDto } from './game.dto';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
@UseGuards(GameGuard)
export class GameGateway {
  constructor(private readonly gameService: GameService) {}


  @WebSocketServer() server: Server;
  fps = 1000 / 60;

  async handleConnection(client: Socket) {
    console.log('handleConnection', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('handleDisconnect', client.id);
    this.gameService.removeMatchingClient(client);
  }

  @SubscribeMessage('game-randomStart-rank-pn')
  handleStartGame(@MessageBody() data: any, @ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
    const nickname = payload.intraNickname;
    const [ roomName, player1Id, player2Id ] = this.gameService.match(client, nickname);
    if (!roomName) this.server.to(client.id).emit('game-loading');
    if (!player1Id || !player2Id) return;
    this.server.to(roomName).emit('game-randomStart-rank-pn', {player1Id, player2Id});
  }

  @SubscribeMessage('game-keyEvent')
  handleGameKeyEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
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
  handleScore(@MessageBody() data: {playerNumber: PlayerNumber, score: Score}, @ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
    console.log('INFO: game-score', data);
    const roomName = this.gameService.getGameRoom(client);
    const gameInfo = this.gameService.getGameInfo(roomName);
    if (!gameInfo) return ;

    if (this.gameService.isReadyScoreCheck(gameInfo, data.playerNumber, data.score)) {
      const winnerNickname = this.gameService.checkCorrectScoreWhoWinner(gameInfo)
      console.log('INFO: 승자 발견', winnerNickname);
      gameInfo.score = winnerNickname === '' ? gameInfo.score : gameInfo.waitList[0].score;
      this.server.to(roomName).emit('game-score', { realScore: gameInfo.score, winnerNickname });
      gameInfo.waitList = [];
    }
  }

  @SubscribeMessage('game-ball')
  handleBall(@MessageBody() ball: BallInfo, @ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
    const roomName = this.gameService.getGameRoom(client);
    const updatedBallInfo = this.gameService.reconcilateBallInfo(roomName, ball);
    if (!updatedBallInfo) return;
    this.server.to(roomName).emit('game-ball', updatedBallInfo);
  }
}

