import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { UserService } from 'src/user.service';
import { FriendsService } from './friends.service';
import { Socket } from 'socket.io';

@UseGuards(Gateway2faGuard)
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
export class FriendsGateway {
  constructor(
    private readonly userService: UserService,
    private readonly friendsService: FriendsService,
  ) {}

  @SubscribeMessage('friend-online-list')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { intraIdList: [] }) {
    const userInfoLIst = this.userService.getUserInfoByIntraIdList(payload.intraIdList);
    client.emit('friend-online-list', userInfoLIst);
  }

}
