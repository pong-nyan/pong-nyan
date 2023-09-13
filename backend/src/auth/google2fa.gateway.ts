import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'src/type/socketType';
import { UserService } from 'src/user.service';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';
import { UseGuards } from '@nestjs/common';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';

@UseGuards(Gateway2faGuard)
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class Google2faGateway {
  constructor(private readonly userService: UserService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('[Gateway2faGuard] Connection ', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('[Gateway2faGuard] Disconnection ', client.id);
    // this.userService.deleteIdMap(client.id);
  }

  @SubscribeMessage('auth-set-map')
  handleAuthSetMap(@ConnectedSocket() client: Socket, @PnJwtPayload() payload: PnPayloadDto) {
    console.log('handleAuthSetMap client.id intraId', client.id, payload.intraId);
    // this.userService.setIdMap(client.id, payload.intraId);
  }
}
