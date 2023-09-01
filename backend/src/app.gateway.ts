import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game/game.service';

import { UserService } from "./user.service";
import { Channel, UserInfo, ChannelInfo } from "./type/channel";

@WebSocketGateway({
  cors: { origin: "*" },
  path: "/socket/",
  cookie: true,
})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService
  ) {}

  async handleConnection(client: Socket) {
    console.log('AppGateway Connection', client.id);
    // get client cookie
    const cookie = client.handshake.headers.cookie;
    console.log('cookie', cookie);
  }


  async handleDisconnect(client: Socket) {
    console.log('AppGateway Disconnection');
  }
}
