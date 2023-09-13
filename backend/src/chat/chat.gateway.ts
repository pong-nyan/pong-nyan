import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { ChannelInfo, Message, Channel } from 'src/type/chatType';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user.service';
import { sha256 } from 'js-sha256';
import { Controller2faGuard } from 'src/guard/controller2fa.guard';

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
    // TODO : minsuki2주장 제일 최신 소켓만 작동하게 함
    // const userInfo = this.userService.getUserInfo(payload.intraId);
    // if (client.id !== userInfo.clientId) return ;
    if (channelInfo.password) {
      channelInfo.password = sha256(channelInfo.password);
    }
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
    if (channel.maxUsers < channel.userList.length) {
      client.emit('chat-join-error', '채널이 가득 찼습니다.');
      return ;
    }
    if (channel.channelType === 'private') {
      if (!channel.invitedUsers.includes(payload.intraId)) {
        client.emit('chat-join-error', '이 채널에는 초대받지 않은 사용자는 접속할 수 없습니다.');
        return;
      }
    } else if (channel.channelType === 'protected') {
      if (channel.password !== payloadEmit.password) {
        client.emit('chat-join-error', '비밀번호가 잘못되었습니다.');
        return ;
      }
    }
    client.join(payloadEmit.channelId);
    this.chatService.joinChannel(payloadEmit.channelId, payload.intraId);
    if (!this.syncAfterChannelChange(channel, client)) return ;
    // 프론트의 전체 채널 목록 업데이트
    const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
  }

  @SubscribeMessage('chat-request-channel-info')
  handleChannelInfoRequest(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string }) {
      const channel = this.chatService.getChannel(payloadEmit.channelId);
      if (!this.syncAfterChannelChange(channel, client)) return ;
    }

  // 메시지 보내기 버튼 누른 직후
  @SubscribeMessage('chat-message-in-channel')
  handleMessageInChannel(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string, message: Message }, @PnJwtPayload() payload: PnPayloadDto) {
    console.log('chat-message-in-channel, payload', payloadEmit);

    // 해당 채널에 모두에게 chat-new-message 전송
    this.server.to(payloadEmit.channelId).emit('chat-new-message', { channelId: payloadEmit.channelId, message: payloadEmit.message });
  }

  @SubscribeMessage('chat-leave-channel')
  handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string, @PnJwtPayload() payload: PnPayloadDto) {
      const channel = this.chatService.getChannel(channelId);
      client.leave(channelId);
      const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
      this.chatService.leaveChannel(channelId, payload.intraId);
      this.userService.deleteUserInfoChatRoomList(payload.intraId, channelId);
      if (!this.syncAfterChannelChange(channel, client)) return ;
      this.server.emit('chat-update-channel-list', updatedChannelList);
  }

  @SubscribeMessage('chat-request-channel-list')
  handleRequestChannelList(@ConnectedSocket() client: Socket) {
    const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
    client.emit('chat-update-channel-list', updatedChannelList);
  }

  @SubscribeMessage('chat-watch-new-message')
  handleSetNewMessage(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string }) {
    const channel = this.chatService.getChannel(payloadEmit.channelId);
    if (!channel) return;

    //해당 채널의 모든 사용자에게 전송
    this.server.to(payloadEmit.channelId).emit('chat-watch-new-message', { channelId: payloadEmit.channelId });
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('[ChatGateway] handleConnection', client.id);
    // pnJwt 검증
    if (!this.userService.checkPnJwt(client)) return;
    // intraId 검색
    const intraId = this.userService.getIntraId(client.id);
    if (!intraId) return;

    // 사용자 정보 검색
    const userInfo = this.userService.getUserInfo(intraId);
    if (!userInfo) return;

    // 사용자가 이전에 접속했던 채팅방 목록
    const userChatRooms = userInfo.chatRoomList;
    console.log('[ChatGateway] userChatRooms', userChatRooms);

    // 사용자가 이전에 접속했던 모든 채팅방에 다시 연결
    for (const room of userChatRooms) {
        const chatInfo = this.chatService.getChannel(room);
        if (!chatInfo) continue;
        client.join(room);
        console.log('[ChatGateway] reconnected to room', room);
        // TODO: 이거 제대로 반영될지 확인해보기
        const channel = this.chatService.getChannel(room);
        if (!this.syncAfterChannelChange(channel, client)) return ;
    }
  }

  // 오류있으면 false
  syncAfterChannelChange(channel:Channel, client: Socket){
    if (!channel) {
      client.emit('chat-response-channel-info', { error: '채널이 존재하지 않습니다.' });
      return false;
    }
    client.emit('chat-response-channel-info', { channel });
    return true;
  }
}
