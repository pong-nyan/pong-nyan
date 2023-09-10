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
    const payload = this.userService.checkPnJwt(client)
    if (!payload) return;
    this.userService.setIdMap(client.id, payload.intraId);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('[AppGateway] Disconnection ', client.id);
    this.userService.deleteIdMap(client.id);
  }
}
