import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { ChannelInfo } from 'src/type/chatType';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { UserService } from 'src/user.service';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
})
@UseGuards(Gateway2faGuard)
export class ChannelGateway {
  constructor(private readonly channelService: ChannelService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService) {}

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
  handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() payload: { channelId: string, password?: string }, @PnJwtPayload() pnPayload: PnPayloadDto) {
    const channel = this.channelService.getChannel(payload.channelId);
    console.log('chat-join-channel, payload', payload);
    console.log('chat-join-channel, channel', channel);
    if (!channel) {
      client.emit('chat-join-error', '채널이 존재하지 않습니다.');
      return ;
    }
    if (channel.channelType === 'private') {
      if (!channel.invitedUsers.includes(pnPayload.intraId)) {
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
    this.channelService.joinChannel(payload.channelId, pnPayload.intraId);
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
  handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string, @PnJwtPayload() payload: PnPayloadDto) {
      client.leave(channelId);
      //TODO
      this.channelService.leaveChannel(channelId, payload.intraId);
      const users = this.channelService.getChannelUsers(channelId);
      this.server.to(channelId).emit('chat-update-users', users);
  }

  @SubscribeMessage('chat-request-channel-list')
  handleRequestChannelList(@ConnectedSocket() client: Socket) {
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    client.emit('chat-update-channel-list', updatedChannelList);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('[ChannelGateway] Connection', client.id);

    if (!this.userService.checkPnJwt(client)) return ;
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('[ChannelGateway] Disconnection', client.id);

    if (!this.userService.checkPnJwt(client)) return ;
    // F5또는 새로고침 이런식으로 새로 접속하지만 pn-jwt가 있을 경우
    // TODO: 이전 채널에 접속
    // const userInfo = this.userService.getUserInfo(client.id);
    // if (!userInfo) return ;
    // const intraId = this.userService.getIntraId(client.id);
    // const userInfo = this.userService.getUser(intraId);
  }
}

// TODO : setUserInfoChatRoomList 만들기
    // chatRoomList: RoomName[],
