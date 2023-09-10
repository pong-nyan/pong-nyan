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
    console.log('AppGateway Connection', client.id);
    if (!this.userService.checkPnJwt(client)) return ;
    console.log('AppGateway Connection, befor auth-set-map-payload client.id', client.id);
    this.server.to(client.id).emit('auth-set-map-payload');
    console.log('AppGateway Connection, idMap', this.userService.idMap);
  }

  async handleDisconnect(client: Socket) {
    console.log('AppGateway Disconnection client.id', client.id);
    console.log('AppGateway Disconnection', this.userService.idMap);
    this.userService.deleteIdMap(client.id);
  }
}
