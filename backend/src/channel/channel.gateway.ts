import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { ChannelInfo } from '../type/channel';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';

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
  handleMakeChannel(client: any, channelInfo: ChannelInfo) {
    this.channelService.addChannel(channelInfo, client);
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
    // console.log('chat-ch-make, updatedChList', updatedChannelList);
  }

  @SubscribeMessage('chat-join-channel')
  handleJoinChannel(client: any, channelId: string) {
    client.join(channelId);
    this.channelService.joinChannel(channelId, client.id);
    const users = this.channelService.getChannelUsers(channelId);
    console.log('chat-join-channel, channelId, users', channelId, users);

    // 해당 채널의 유저 목록 업데이트
    this.server.to(channelId).emit('chat-update-users', users);

    // 전체 채널 목록 업데이트
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
  }

  @SubscribeMessage('chat-message-in-channel')
  handleMessageInChannel(client: any, payload: { channelId: string, message: string }) {
    // 해당 채널의 모든 사용자에게 메시지 전송
    console.log('chat-message-in-channel, payload', payload);
    const chTest = this.channelService.getChannel(payload.channelId);
    console.log('chat-message-in-channel, chTest', chTest);
    this.server.to(payload.channelId).emit('chat-new-message', payload.message);
  }

  @SubscribeMessage('chat-leave-channel')
  leaveChannel(client: any, channelId: string) {
      this.channelService.leaveChannel(channelId, client.id);
      const users = this.channelService.getChannelUsers(channelId);
      this.server.to(channelId).emit('chat-update-users', users);
  }

  handleConnection(client: any) {
    console.log('in cha gateway handleConnection');
    console.log('client connected', client.id);
    console.log('client', client.rooms);
    client.userId = uuidv4(); // 임의의 UUID로 사용자 ID 할당
    console.log('client.id uuidv4', client.id);
  }
}
