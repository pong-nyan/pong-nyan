import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: { origin: '*' },
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private service: GameService) { }

  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;

  async handleConnection(client: Socket) {
    console.log('Connection', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnection');
  }

  @SubscribeMessage('ball')
  handleBall(client: Socket, data: any) {
    client.broadcast.emit('ball', data);
  }

  @SubscribeMessage('startGame')
  handleStartGame(client: Socket, data: any) {
    const roomName = this.service.match(client);
    if (!roomName)
      this.server.to(client.id).emit('loading');
    console.log(roomName);
    this.server.to(roomName).emit('start');
  }
}