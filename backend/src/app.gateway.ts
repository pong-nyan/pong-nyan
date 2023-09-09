import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PnJwtPayload, PnPayloadDto } from 'src/game/game.dto';
import { UserService } from './user.service';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService) {}


  async handleConnection(@ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
    console.log('AppGateway Connection', client.id);
    // this.userService.addUser(client.id, payload.intraId);
  }

  async handleDisconnect(client: Socket) {
    console.log('AppGateway Disconnection');
    // this.userService.removeUser(client.id);
  }
}
