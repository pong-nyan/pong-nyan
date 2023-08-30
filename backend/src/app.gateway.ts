import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game/game.service';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  async handleConnection(client: Socket) {
    console.log('AppGateway Connection');
  }


  async handleDisconnect(client: Socket) {
    console.log('AppGateway Disconnection');
  }
}
