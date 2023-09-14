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
import { IntraId } from 'src/type/userType';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
  namespace: '/chat',
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

    if (channel.userList.includes(payload.intraId)) {
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

    if (!this.syncAfterChannelChange(channel)) return ;
  }

  @SubscribeMessage('chat-request-channel-info')
  handleChannelInfoRequest(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string }) {
      const channel = this.chatService.getChannel(payloadEmit.channelId);
      if (!this.syncAfterChannelChange(channel)) return ;
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
      this.chatService.leaveChannel(channelId, payload.intraId);
      this.userService.deleteUserInfoChatRoomList(payload.intraId, channelId);
      // 나간사람이 owner이면 채널 삭제
      if (channel.owner === payload.intraId) {
        this.chatService.getChannelMap().delete(channelId);
      }
      if (!this.syncAfterChannelChange(channel)) return ;
      const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
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

  @SubscribeMessage('chat-grant-administrator')
  handleGrantAdministrator(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string, user: IntraId }, @PnJwtPayload() payload: PnPayloadDto) {
    const channel = this.chatService.getChannel(payloadEmit.channelId);
    const grantedUserId = payloadEmit.user;
    if (!channel) return;
    // owner만 임명 가능
    if (channel.owner !== payload.intraId) {
      client.emit('chat-catch-error-message', '관리자 임명 권한이 없습니다.');
      return ;
    }
    // 이미 administrator인 경우
    if (channel.administrator.includes(grantedUserId)) {
      client.emit('chat-catch-error-message', '이미 관리자입니다.');
      return ;
    }
    this.chatService.grantAdministrator(payloadEmit.channelId, grantedUserId);
    if (!this.syncAfterChannelChange(channel)) return ;
    client.emit('chat-finish-message', '관리자 임명에 성공했습니다.');
  }

  @SubscribeMessage('chat-delete-administrator')
  handleDeleteAdministrator(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string, user: IntraId }, @PnJwtPayload() payload: PnPayloadDto) {
    const channel = this.chatService.getChannel(payloadEmit.channelId);
    const deletedUserId = payloadEmit.user;
    if (!channel) return;
    // owner만 삭제 가능
    if (channel.owner !== payload.intraId) {
      client.emit('chat-catch-error-message', '관리자 삭제 권한이 없습니다.');
      return ;
    }
    // administrator가 아닌 경우
    if (!channel.administrator.includes(deletedUserId)) {
      client.emit('chat-catch-error-message', '관리자가 아닙니다.');
      return ;
    }
    this.chatService.deleteAdministrator(payloadEmit.channelId, deletedUserId);
    if (!this.syncAfterChannelChange(channel)) return ;
    client.emit('chat-delete-administrator-finish', '관리자 삭제에 성공했습니다.');
  }

  @SubscribeMessage('chat-change-password')
  handleChangePassword(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string, password: string }, @PnJwtPayload() payload: PnPayloadDto) {
    console.log('chat-change-password, payloadEmit', payloadEmit);
    const channel = this.chatService.getChannel(payloadEmit.channelId);
    if (!channel) return;
    // owner만 변경 가능
    if (channel.owner !== payload.intraId) {
      client.emit('chat-catch-error-message', '비밀번호 변경 권한이 없습니다.');
      return ;
    }
    channel.password = payloadEmit.password;
    channel.channelType = 'protected';
    if (!this.syncAfterChannelChange(channel)) return ;
    const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
    client.emit('chat-update-channel-list', updatedChannelList);

    client.emit('chat-finish-message', '비밀번호 변경에 성공했습니다.');
  }

  @SubscribeMessage('chat-remove-password')
  handleRemovePassword(@ConnectedSocket() client: Socket, @MessageBody() payloadEmit: { channelId: string }, @PnJwtPayload() payload: PnPayloadDto) {
    const channel = this.chatService.getChannel(payloadEmit.channelId);
    if (!channel) return;
    // owner만 비번 제거 가능
    if (channel.owner !== payload.intraId) {
      client.emit('chat-catch-error-message', '비밀번호 제거 권한이 없습니다.');
      return ;
    }
    channel.password = '';
    channel.channelType = 'public';
    if (!this.syncAfterChannelChange(channel)) return ;
    const updatedChannelList = Array.from(this.chatService.getChannelMap().values());
    client.emit('chat-update-channel-list', updatedChannelList);

    client.emit('chat-finish-message', '비밀번호 제거에 성공했습니다.');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('[ChatGateway] handleConnection', client.id);

    const pnPayload = this.userService.checkPnJwt(client);
    if (!pnPayload) return;
    this.userService.setIdMap(client.id, pnPayload.intraId);

    const userInfo = this.userService.getUserInfo(pnPayload.intraId);
    if (!userInfo) {
      this.userService.setUserMap(pnPayload.intraId, {
        client: { game: undefined, chat: client },
        nickname: pnPayload.nickname,
        chatRoomList: [],
        gameRoom: '',
        online: true,
      });
      return ;
    } else {
      this.server.to(userInfo.client.chat?.id).emit('add-tab');
      userInfo.online = true;
      userInfo.client.chat = client;
    }

    console.log('[ChatGateway] have a userInfo', userInfo);

    const intraId = this.userService.getIntraId(client.id);
    if (!intraId) return;

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
        if (!this.syncAfterChannelChange(channel)) return ;
    }
  }

  syncAfterChannelChange(channel:Channel) {
    console.log('syncAfterChannelChange');
    if (!channel) return false;
    this.server.to(channel.id).emit('chat-response-channel-info', { channel });
    return true;
  }
}
