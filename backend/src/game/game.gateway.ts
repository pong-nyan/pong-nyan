import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { KeyEvent } from './objects/game.interface';

@WebSocketGateway({
  cors: { origin: '*' },
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) { }

  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;

  setIntervalId = setInterval(() => {
    this.server.emit('balls', this.gameService.balls);
  }, this.fps);

  @SubscribeMessage('game')
  handleGame(@MessageBody() keyEvent: KeyEvent, @ConnectedSocket() client: Socket) {
    this.gameService.moveBall(keyEvent.keyCode, client.id);
  }

  async handleConnection(client: Socket) {
    this.gameService.addBall(client.id);
    console.log('Connection', this.gameService.balls);
  }

  async handleDisconnect(client: Socket) {
    this.gameService.removeBall(client.id);
    console.log('Disconnection', this.gameService.balls);
  }
}