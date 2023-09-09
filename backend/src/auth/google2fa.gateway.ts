import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'src/type/socketType';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user.service';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class Google2faGateway {
  constructor(private readonly userService: UserService) {}

  @SubscribeMessage('auth-set-map')
  handleAuthSetMap(@ConnectedSocket() client: Socket, @MessageBody() payload : { intraId: number }) {
    this.userService.setIdMap(client.id, payload.intraId);
  }
}
