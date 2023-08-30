import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { ChannelInfo } from '../type/channel';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})
export class ChannelGateway {
  constructor(private readonly channelService: ChannelService) {}

  @SubscribeMessage('chat-channel-make')
  makeChannel(client: any, channelInfo: ChannelInfo) {
    this.channelService.addChannel(channelInfo, client);
    const updatedChannelList = Array.from(this.channelService.getChannelMap().values());
    client.server.emit('chat-update-channel-list', updatedChannelList);
    console.log('chat-ch-make, updatedChList', updatedChannelList);
  }

  @SubscribeMessage('chat-join-channel')
  handleJoinChannel(client: any, channelId: string) {
    // channelId값의 room에 입장
    client.join(channelId);
    // 필요한 경우 추가 작업 수행 (예: 채널에 입장한 사용자 목록 업데이트 등)

  }

  handleConnection(client: any) {
    console.log('in cha gateway handleConnection');
    console.log('client connected', client.id);
    console.log('client', client.rooms);
    client.userId = uuidv4(); // 임의의 UUID로 사용자 ID 할당
    console.log('client.id uuidv4', client.id);
  }
}
