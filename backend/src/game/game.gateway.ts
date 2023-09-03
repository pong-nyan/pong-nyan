import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { BallInfo, PlayerNumber } from '../type/game';
// import { UserService } from "../user.service;

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  waitLength: number = 0;

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
  handleStartGame(client: Socket, data: any) {
    const ret = this.gameService.match(client);
    const roomName = ret?.roomName;
    const p1 = ret?.p1;
    const p2 = ret?.p2;
    if (!roomName) this.server.to(client.id).emit('game-loading');
    this.server.to(roomName).emit('game-randomStart', {p1, p2});
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

  // TODO: sensor에 닿을 시 score 변경
  @SubscribeMessage('game-score')
  handleScore(client: Socket, data: {playerNumber: PlayerNumber, loser: PlayerNumber}) {
    console.log('game-score', data);
    const roomName = this.gameService.getGameRoom(client);
    console.log('roomName', roomName);

    console.log('waitLength', this.waitLength);
    if (++this.waitLength === 2) {
      this.waitLength = 0;
      this.server.to(roomName).emit('game-score', { loser: data.loser, });
    }
    // const roomName = client.rooms.forEach((room) => {
    //   if (room.startsWith('game-')) {
    //     console.log('forEach', room);
    //     return room;
    //   }
    // });
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
    if (roomName === '') return;

    const updatedBallInfo = this.gameService.reconcilateBallInfo(roomName, ball);
    if (!updatedBallInfo) return;
    this.server.to(roomName).emit('game-ball', updatedBallInfo);
  }
}
