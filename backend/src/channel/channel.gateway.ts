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
  makeChannel(client: any, channelInfo: ChannelInfo) {
    this.channelService.addChannel(channelInfo, client);
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    this.server.emit('chat-update-channel-list', updatedChannelList);
    console.log('chat-ch-make, updatedChList', updatedChannelList);
  }

  @SubscribeMessage('chat-join-channel')
  handleJoinChannel(client: any, channelId: string) {
    // channelId값의 room에 입장
    client.join(channelId);
    // TODO: 채널에 입장한 사용자 목록 업데이트
  }

  @SubscribeMessage('chat-message-in-channel')
  handleMessageInChannel(client: any, payload: { channelId: string, message: string }) {
    // 해당 채널의 모든 사용자에게 메시지 전송
    this.server.to(payload.channelId).emit('chat-new-message', payload.message);
  }

  @SubscribeMessage('chat-leave-channel')
  leaveChannel(client: any, channelId: string) {
    client.leave(channelId);
  }

  handleConnection(client: any) {
    console.log('in cha gateway handleConnection');
    console.log('client connected', client.id);
    console.log('client', client.rooms);
    client.userId = uuidv4(); // 임의의 UUID로 사용자 ID 할당
    console.log('client.id uuidv4', client.id);
  }
}
