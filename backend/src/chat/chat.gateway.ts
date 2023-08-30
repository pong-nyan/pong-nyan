import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
})

export class ChatGateway {
  @SubscribeMessage('chat-message')
  handleMessage(client: any, payload: any): string {
    console.log('chat/message client : ', client.id, '-----------------------------------------------');
    console.log('chat/message payload :', payload);
    return 'Hello world!';
  }

  @SubscribeMessage('chat-private-message')
  handlePrivateMessage(client: any, payload: { targetUserId: string, message: string }) {
    // targetUserId에 해당하는 사용자에게만 메시지를 전달합니다.
    client.server.to(payload.targetUserId).emit('chat-private-message', payload.message);
  }

}
