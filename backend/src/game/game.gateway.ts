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
              // private readonly authService: AuthService
  @WebSocketServer()
  server: Server;
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
  handleScore(client: Socket, data: {playerNumber: PlayerNumber, score: Score}) {
    console.log('game-score', data);
    const gameInfo = this.gameService.getGameInfo(client);
    if (!gameInfo) return false;
    console.log('myGameInfo', gameInfo);

    if (this.gameService.isReadyScoreCheck(gameInfo, data.playerNumber, data.score)) {
      if ((gameInfo.waitList[0].score.p1 === gameInfo.waitList[1].score.p1)
          && (gameInfo.waitList[0].score.p2 === gameInfo.waitList[1].score.p2)) {
        console.log('INFO: 두 클라이언트의 점수가 같음');
        gameInfo.score = gameInfo.waitList[0].score;
        this.server.to(gameInfo.roomName).emit('game-score', { score: data.score });
      } else {
        //TODO: 두 클라이언트의 점수가 다를 경우
        console.log('PROBLEM: 두 클라이언트의 점수가 다름');
      }
      gameInfo.waitList = [];
    }
  }

  @SubscribeMessage('game-ball')
  handleBall(client: Socket, ball: BallInfo) {
    const gameInfo = this.gameService.getGameInfo(client);
    const updatedBallInfo = this.gameService.reconcilateBallInfo(gameInfo.roomName, ball);
    if (!updatedBallInfo) return;
    this.server.to(gameInfo.roomName).emit('game-ball', updatedBallInfo);
  }
}
