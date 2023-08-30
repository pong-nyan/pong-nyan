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

  async handleConnection(client: Socket) {
    console.log('GameGateway Connection', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('GameGateway Disconnection', client.id);
    this.gameService.removeMatchingClient(client);
  }

  @SubscribeMessage('game-start')
  handleStartGame(client: Socket, data: any) {
    console.log('game-start');
    const ret = this.gameService.match(client);
    const roomName = ret?.roomName;
    const p1 = ret?.p1;
    const p2 = ret?.p2;
    if (!roomName) this.server.to(client.id).emit('loading');
    this.server.to(roomName).emit('start', {p1, p2});
  }

  @SubscribeMessage('game-keyEvent')
  handleGameKeyEvent(client: Socket, data: any) {
    this.server.to(data.opponentId).emit('game-keyEvent', {
      opponentNumber: data.playerNumber,
      message: data.message,
      step: data.step,
      velocity: data.velocity
    });
  }

  @SubscribeMessage('game-score')
  handleScore(client: Socket, data: any) {
    const roomName = client.rooms.forEach((room) => {
        if (room.startsWith('game-')) {
            console.log('forEach', room);
            return room;
        }
    });

  }

  @SubscribeMessage('game-ball')
  handleBall(client: Socket, ball: BallInfo) {
    // get game-roomName
    // TODO : refactoring
    // const roomName = Array.from(client.rooms).find(room => room.startsWith('game-'));
    // if (!roomName) return;

    let roomName = '';
    for (const value of client.rooms) {
       if (value.startsWith('game-'))
          {
            roomName = value;
            break;
          }
    }
    console.log('game-ball', roomName);
    if (roomName === '') return;

    const updatedBallInfo = this.gameService.reconcilateBallInfo(roomName, ball);
    if (!updatedBallInfo) return;
    this.server.to(roomName).emit('game-ball', updatedBallInfo);
  }
}
