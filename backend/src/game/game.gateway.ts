import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { BallInfo, PlayerNumber } from '../type/game';
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
  waitLength: 0;

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
  handleStartGame(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
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
function ConnectionSocket(): (target: GameGateway, propertyKey: 'handleStartGame', parameterIndex: 1) => void {
  throw new Error('Function not implemented.');
}

