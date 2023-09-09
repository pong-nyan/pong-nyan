import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PnJwtPayload, PnPayloadDto } from 'src/game/game.dto';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

@UseGuards(AuthGuard)
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService) {}


  async handleConnection(@ConnectedSocket() client: Socket) {


    console.log('AppGateway Connection', client.id);
    if (this.userService.checkPnJwt(client))
    {
      return ;
    }
    const intraId = this.userService.getIntraId(client.id);
    this.userService.setIdMap(client.id, intraId);
  }

  async handleDisconnect(client: Socket) {
    console.log('AppGateway Disconnection');
    this.userService.deleteIdMap(client.id);
  }
}
