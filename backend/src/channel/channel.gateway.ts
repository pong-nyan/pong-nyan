import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { ChannelInfo } from '../type/channel';
import { v4 as uuidv4 } from 'uuid';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})

export class ChannelGateway {
  constructor(private readonly channelService: ChannelService) {}

  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;

  @SubscribeMessage('chat-channel-make')
  handleMakeChannel(client: Socket, channelInfo: ChannelInfo) {
    this.channelService.addChannel(channelInfo, client);
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
    console.log('chat-ch-make, updatedChList', updatedChannelList);
  }

  @SubscribeMessage('chat-join-channel')
  handleJoinChannel(client: Socket, payload: { channelId: string, password?: string }) {
    const channel = this.channelService.getChannel(payload.channelId);
    console.log('chat-join-channel, payload', payload);
    console.log('chat-join-channel, channel', channel);
    if (!channel) {
      client.emit('chat-join-error', '채널이 존재하지 않습니다.');
      return ;
    }
    if (channel.channelType === 'private') {
      // 초대 목록에 존재하는지 확인
      if (!channel.invitedUsers.includes(client.id)) {
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
    this.channelService.joinChannel(payload.channelId, client.id);
    const users = this.channelService.getChannelUsers(payload.channelId);
    console.log('chat-join-channel, channelId, users', payload.channelId, users);

    // 해당 채널의 유저 목록 업데이트
    this.server.to(payload.channelId).emit('chat-update-users', users);

    // 전체 채널 목록 업데이트
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
  }

  @SubscribeMessage('chat-message-in-channel')
  handleMessageInChannel(client: Socket, payload: { channelId: string, message: string }) {
    // 해당 채널의 모든 사용자에게 메시지 전송
    console.log('chat-message-in-channel, payload', payload);
    const chTest = this.channelService.getChannel(payload.channelId);
    console.log('chat-message-in-channel, chTest', chTest);
    this.server.to(payload.channelId).emit('chat-new-message', payload.message);
  }

  @SubscribeMessage('chat-leave-channel')
  handleLeaveChannel(client: Socket, channelId: string) {
      client.leave(channelId);
      this.channelService.leaveChannel(channelId, client.id);
      const users = this.channelService.getChannelUsers(channelId);
      this.server.to(channelId).emit('chat-update-users', users);
  }

  // TODO: Socket이 userId를 담고 있지 않아서 오류가 생김
  handleConnection(client: any) {
    console.log('in cha gateway handleConnection');
    console.log('client connected', client.id);
    console.log('client', client.rooms);
    client.userId = uuidv4(); // 임의의 UUID로 사용자 ID 할당
    console.log('client.id uuidv4', client.id);
  }
}
