import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { ChannelInfo } from '../type/channel';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})
export class ChannelGateway {
  constructor(private readonly channelService: ChannelService) {}

  @SubscribeMessage('channel-make')
  makeChannel(client: any, channelInfo: ChannelInfo) {
    this.channelService.addChannel(channelInfo, client);
    console.log('channelInfo channel/make :', channelInfo);
    console.log('chalist', this.channelService.getChannelMap());
    console.log('client', client.rooms);
  }
}
