import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;


  async handleConnection(client: Socket) {
    console.log('Connection');
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnection');
  }
}