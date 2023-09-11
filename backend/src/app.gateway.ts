import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { WebSocketServer } from '@nestjs/websockets';

@UseGuards(AuthGuard)
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('[AppGateway] Connection ', client.id);
    const pnPayload = this.userService.checkPnJwt(client)
    if (!pnPayload) return;
    this.userService.setIdMap(client.id, pnPayload.intraId);

    /* 코드 수정하면 서버가 재시작하는 이유 때문에 잠깐 필요...
     * 계속 2차인증 로그인해야 함
     */
    const userInfo = this.userService.getUserInfo(pnPayload.intraId);
    if (userInfo) {
      console.log('>>> [AppGateway] userInfo is not null');
      return;
    }
    console.log('>>> [AppGateway] setUserMap');
    this.userService.setUserMap(pnPayload.intraId, {
      nickname: pnPayload.nickname,
      chatRoomList: [],
      gameRoom: ''
    });
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('[AppGateway] Disconnection ', client.id);
  }
}
