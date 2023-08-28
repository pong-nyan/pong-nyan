import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
// import { UserService } from "../user.service";
import { BallInfo } from '../type/game';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;

  @SubscribeMessage('game-start')
  handleStartGame(client: Socket, data: any) {
    console.log('game-start');
    const ret = this.gameService.match(client);
    const roomName = ret?.roomName;
    const p1 = ret?.p1;
    const p2 = ret?.p2;
    if (!roomName) this.server.to(client.id).emit('loading');
    // else this.gameService.addGame(roomName);
    this.server.to(roomName).emit('start', {p1, p2});
  }

  @SubscribeMessage('game-event')
  handleGameEvent(client: Socket, data: any) {
    this.server.to(data.opponentId).emit('game-keyEvent', {
      opponentNumber: data.playerNumber,
      message: data.message,
      step: data.step,
      velocity: data.velocity
    });
  }

  @SubscribeMessage('game-ball')
  handleBall(client: Socket, ball: BallInfo) {
    // get game-roomName
    let roomName = '';
    for (const value of client.rooms) {
       if (value.startsWith('game-'))
          {
            roomName = value;
            break;
          }
    }
    if (roomName === '') return;

    const updatedBallInfo = this.gameService.reconcilateBallInfo(roomName, ball);
    if (!updatedBallInfo) return;
    this.server.to(roomName).emit('game-ball', updatedBallInfo);
  }
}
