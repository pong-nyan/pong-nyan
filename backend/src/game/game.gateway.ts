import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { BallInfo, PlayerNumber, Score } from 'src/type/game';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
// import { UserService } from "../user.service;

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class GameGateway {
  constructor(private readonly gameService: GameService,
              private readonly jwtService: JwtService) {}

  @WebSocketServer() server: Server;
  fps = 1000 / 60;

  async handleConnection(client: Socket) {
    console.log('GameGateway Connection', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('GameGateway Disconnection', client.id);
    this.gameService.removeMatchingClient(client);
  }


  @SubscribeMessage('game-randomStart')
  handleStartGame(client: Socket) {
    const pnJwt = parse(client.handshake.headers.cookie)['pn-jwt'];
    const decodedJwt = JSON.parse(JSON.stringify(this.jwtService.decode(pnJwt)));
    const [ roomName, player1Id, player2Id ] = this.gameService.match(client, decodedJwt.nickname);
    if (!roomName) this.server.to(client.id).emit('game-loading');
    if (!player1Id || !player2Id) return;
    this.server.to(roomName).emit('game-randomStart', {player1Id, player2Id});
  }

  @SubscribeMessage('game-keyEvent')
  handleGameKeyEvent(client: Socket, data: any) {
    console.log('INFO: game-keyEvent', data.message);
    this.server.to(data.opponentId).emit('game-keyEvent', {
      opponentNumber: data.playerNumber,
      message: data.message,
      step: data.step,
      velocity: data.velocity
    });
  }

  // TODO: sensor에 닿을 시 score 변경
  @SubscribeMessage('game-score')
  handleScore(client: Socket, data: {playerNumber: PlayerNumber, score: Score}) {
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
  handleBall(client: Socket, ball: BallInfo) {
    const roomName = this.gameService.getGameRoom(client);
    // const gameInfo = this.gameService.getGameInfo(roomName);
    const updatedBallInfo = this.gameService.reconcilateBallInfo(roomName, ball);
    if (!updatedBallInfo) return;
    this.server.to(roomName).emit('game-ball', updatedBallInfo);
  }
}
