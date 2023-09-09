import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { ChannelInfo } from 'src/type/chatType';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChannelGuard } from './channel.guard';
import { PnJwtPayload } from 'src/chat/channel.dto';
import { PnPayloadDto } from './channel.dto';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
@UseGuards(ChannelGuard)
export class ChannelGateway {
  constructor(private readonly channelService: ChannelService,
    private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;

  @SubscribeMessage('chat-channel-make')
  handleMakeChannel(@ConnectedSocket() client: Socket, @MessageBody() channelInfo: ChannelInfo, @PnJwtPayload() payload: PnPayloadDto) {
    this.channelService.addChannel(channelInfo, client, payload.intraId);
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
    console.log('chat-ch-make, updatedChList', updatedChannelList);
  }

  @SubscribeMessage('chat-join-channel')
  handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: { channelId: string, password?: string }) {
    const channel = this.channelService.getChannel(payload.channelId);
    console.log('chat-join-channel, payload', payload);
    console.log('chat-join-channel, channel', channel);
    if (!channel) {
      client.emit('chat-join-error', '채널이 존재하지 않습니다.');
      return ;
    }
    if (channel.channelType === 'private') {
      if (!channel.invitedUsers.includes(client.intraId)) {
        client.emit('chat-join-error', '이 채널에는 초대받지 않은 사용자는 접속할 수 없습니다.');
        return;
      }
    } else if (channel.channelType === 'protected') {
      if (channel.password !== payload.password) {
        console.log('비번 일치안함');
        client.emit('chat-join-error', '비밀번호가 잘못되었습니다.');
        return ;
      }
    }
    client.emit('chat-join-success');
    client.join(payload.channelId);
    this.channelService.joinChannel(payload.channelId, client.intraId);
    const users = this.channelService.getChannelUsers(payload.channelId);
    console.log('chat-join-channel, channelId, users', payload.channelId, users);

    // 해당 채널의 유저 목록 업데이트
    this.server.to(payload.channelId).emit('chat-update-users', users);

    // 전체 채널 목록 업데이트
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
  }

  @SubscribeMessage('chat-message-in-channel')
  handleMessageInChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: { channelId: string, message: string }) {
    // 해당 채널의 모든 사용자에게 메시지 전송
    console.log('chat-message-in-channel, payload', payload);
    const chTest = this.channelService.getChannel(payload.channelId);
    console.log('chat-message-in-channel, chTest', chTest);
    this.server.to(payload.channelId).emit('chat-new-message', payload.message);
  }

  @SubscribeMessage('chat-leave-channel')
  handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
      client.leave(channelId);
      this.channelService.leaveChannel(channelId, client.intraId);
      const users = this.channelService.getChannelUsers(channelId);
      this.server.to(channelId).emit('chat-update-users', users);
  }

  @SubscribeMessage('chat-request-channel-list')
  handleRequestChannelList(@ConnectedSocket() client: Socket) {
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    client.emit('chat-update-channel-list', updatedChannelList);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('in cha handleConnection');
    const cookies = client.handshake.headers.cookie;
    console.log('cookies', cookies);
    if (!cookies) {
      console.error('Cookies not found');
      return;
    }
    const pnJwtCookie = cookie.parse(cookies)['pn-jwt'];

    if (!pnJwtCookie) {
      console.error('JWT not found');
      return;
    }
    try {
      const payload: PnPayloadDto = this.jwtService.verify<PnPayloadDto>(pnJwtCookie);
      if (payload.exp * 1000 < Date.now()) {
        console.error('JWT expired');
        return;
      }
      client.intraId = payload.intraId;
      console.log('client', client.id);
      console.log('client.intraId', client.intraId);
    } catch (err) {
      console.error('JWT verification failed', err);
    }

    console.log('client.user', client.rooms);
  }
}
