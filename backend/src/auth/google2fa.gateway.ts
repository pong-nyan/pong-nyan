import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'src/type/socketType';
import { UserService } from 'src/user.service';
import { PnJwtPayload, PnPayloadDto } from 'src/game/game.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GatewayGuard } from 'src/context/gateway.guard';

@UseGuards(GatewayGuard)
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class Google2faGateway {
  constructor(private readonly userService: UserService) {}

  @SubscribeMessage('auth-set-map')
  handleAuthSetMap(@ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
    console.log('handleAuthSetMap client.id intraId', client.id, payload.intraId);
    this.userService.setIdMap(client.id, payload.intraId);
  }

  // @SubscribeMessage('auth-set-map-payload')
  // handleAuthSetMapPayload(@ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
  //   console.log('handleAuthSetMapPayload client.id', client.id);
  //   if (!payload) {
  //     console.log('payload null', payload);
  //     return ;
  //   }
  //   console.log('handleAuthSetMapPayload client.id intraId', client.id, payload.intraId);
  //   this.userService.setIdMap(client.id, payload.intraId);
  // }
}
