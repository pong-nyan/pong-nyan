import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})
export class ChannelGateway {
  @SubscribeMessage('channel-make')
  makeChannel(client: any, payload: any): string {
    console.log('channel/make payload :', payload);
    return 'Hello world!';
  }
}
