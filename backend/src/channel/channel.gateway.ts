import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChannelService } from './channel.service';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})
export class ChannelGateway {
  constructor(private readonly channelService: ChannelService) {}

  @SubscribeMessage('channel-make')
  makeChannel(client: any, channelInfo: any): string {
    this.channelService.addChannel(channelInfo.channelTitle, client);
    console.log('channel/make payload :', channelInfo);
    console.log('chalist', this.channelService.getChannelList());
    console.log('client', client.rooms);
    return 'Hello world!';
  }
}
