import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { ChannelInfo } from 'src/type/chatType';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user.service';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
@UseGuards(Gateway2faGuard)
export class ChatGateway {
  constructor(private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;

  @SubscribeMessage('chat-channel-make')
  handleMakeChannel(@ConnectedSocket() client: Socket, @MessageBody() channelInfo: ChannelInfo, @PnJwtPayload() payload: PnPayloadDto) {
    const channelId = this.chatService.addChannel(channelInfo, client, payload.intraId);
    this.userService.setUserInfoChatRoomList(payload.intraId, channelId);
    const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
    console.log('chat-ch-make, updatedChList', updatedChannelList);
  }

  @SubscribeMessage('chat-join-channel')
  handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string, password?: string }, @PnJwtPayload() payload: PnPayloadDto) {
    const channel = this.chatService.getChannel(payloadEmit.channelId);
    console.log('chat-join-channel, payload', payloadEmit);
    console.log('chat-join-channel, channel', channel);
    if (!channel) {
      client.emit('chat-join-error', '채널이 존재하지 않습니다.');
      return ;
    }
    if (channel.channelType === 'private') {
      if (!channel.invitedUsers.includes(payload.intraId)) {
        client.emit('chat-join-error', '이 채널에는 초대받지 않은 사용자는 접속할 수 없습니다.');
        return;
      }
    } else if (channel.channelType === 'protected') {
      if (channel.password !== payloadEmit.password) {
        console.log('비번 일치안함');
        client.emit('chat-join-error', '비밀번호가 잘못되었습니다.');
        return ;
      }
    }
    client.emit('chat-join-success');
    client.join(payloadEmit.channelId);
    this.chatService.joinChannel(payloadEmit.channelId, payload.intraId);
    this.userService.setUserInfoChatRoomList(payload.intraId, payloadEmit.channelId);
    const users = this.chatService.getChannelUsers(payloadEmit.channelId);
    console.log('chat-join-channel, channelId, users', payloadEmit.channelId, users);

    // 해당 채널의 유저 목록 업데이트
    this.server.to(payloadEmit.channelId).emit('chat-update-users', users);

    // 전체 채널 목록 업데이트
    const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
  }

  @SubscribeMessage('chat-request-channel-info')
  handleChannelInfoRequest(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string }) {
      const channel = this.chatService.getChannel(payloadEmit.channelId);
      if (!channel) {
        client.emit('chat-response-channel-info', { error: '채널이 존재하지 않습니다.' });
        return;
      }
      client.emit('chat-response-channel-info', { channel });
  }

  @SubscribeMessage('chat-message-in-channel')
  handleMessageInChannel(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string, message: string }, @PnJwtPayload() payload: PnPayloadDto) {
    // 해당 채널의 모든 사용자에게 메시지 전송
    console.log('chat-message-in-channel, payload', payloadEmit);

    this.server.to(payloadEmit.channelId).emit('chat-new-message', { channelId: payloadEmit.channelId, message: payloadEmit.message, sender: payload.intraId });
  }

  @SubscribeMessage('chat-leave-channel')
  handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string, @PnJwtPayload() payload: PnPayloadDto) {
      client.leave(channelId);
      this.chatService.leaveChannel(channelId, payload.intraId);
      this.userService.deleteUserInfoChatRoomList(payload.intraId, channelId);
      const users = this.chatService.getChannelUsers(channelId);
      this.server.to(channelId).emit('chat-update-users', users);
  }

  @SubscribeMessage('chat-request-channel-list')
  handleRequestChannelList(@ConnectedSocket() client: Socket) {
    const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
    client.emit('chat-update-channel-list', updatedChannelList);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('[ChannelGateway] Connection', client.id);

    if (!this.userService.checkPnJwt(client))
    {
      return ;
    }
    // F5또는 새로고침 이런식으로 새로 접속하지만 pn-jwt가 있을 경우
    // TODO: 이전에 접속했던 채널에 다시 접속시켜주기
    // const userInfo = this.userService.getUserInfo(client.id);
    // if (!userInfo) return ;
    // const intraId = this.userService.getIntraId(client.id);
    // const userInfo = this.userService.getUser(intraId);
  }
}

// TODO : setUserInfoChatRoomList 만들기
    // chatRoomList: RoomName[],
