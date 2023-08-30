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
    console.log('channelInfo channel/make :', channelInfo);
    console.log('chalist', this.channelService.getChannelMap());
    console.log('client', client.rooms);
  }

  handleConnection(client: any) {
    console.log('in cha gateway handleConnection');
    console.log('client connected', client.id);
    console.log('client', client.rooms);
    client.userId = uuidv4(); // 임의의 UUID로 사용자 ID 할당
    console.log('client.id uuidv4', client.id);
  }
}
