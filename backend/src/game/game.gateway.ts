import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { BallInfo, PlayerNumber, Score, GameInfo } from 'src/type/game';
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

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('handleConnection', client.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
    const roomName = this.gameService.getGameRoom(client);
    if (!roomName) {
      console.log('INFO handleDisconnect : 게임 방이 없습니다.');
      this.gameService.removeMatchingClient(client);
      return ;
    }
    const gameInfo = this.gameService.getGameInfo(roomName);
    if (!gameInfo) {
      console.log('INFO handleDisconnect : 게임 정보가 없습니다.');
      client.leave(roomName);
      return ;
    }
    this.server.to(roomName).emit('game-disconnect', { disconnectNickname: payload.nickname, gameInfo } );
  }


  @SubscribeMessage('game-randomStart')
  handleStartGame(@ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
    const nickname = payload.nickname; const [ roomName, player1Id, player2Id ] = this.gameService.match(client, nickname);
    if (!roomName) this.server.to(client.id).emit('game-loading');
    if (!player1Id || !player2Id) return;
    this.server.to(roomName).emit('game-randomStart', {player1Id, player2Id});
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
      const winnerNickname = this.gameService.checkCorrectScoreWhoWinner(gameInfo)
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

