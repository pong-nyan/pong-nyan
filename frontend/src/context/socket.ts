import { io as socketIOClient } from 'socket.io-client';
import { createContext } from 'react';
import { addMessageToLocalStorage } from '@/chat/utils/chatLocalStorage';

export const socket = {
  authNameSpace: socketIOClient('/auth', { path: '/socket/'}),
  gameNamespace: socketIOClient('/game', { path: '/socket/'}),
  chatNamespace: socketIOClient('/chat', { path: '/socket/'})
}

export const SocketContext = createContext(socket);

socket.authNameSpace.on('auth-set-map-payload', () => {
  const user = localStorage.getItem('user');
  if (!user) {
    console.log('user null');
    return ;
  }
  const item = JSON.parse(user);
  console.log('auth-set-map-payload item', item);
  socket.authNameSpace.emit('auth-set-map', { intraId: item.intraId });
});

// 메시지를 받아서 로컬 스토리지에 저장
socket.chatNamespace.on('chat-new-message', (data) => {
  console.log('[Chat] chat-new-message', data);
  // 메시지를 받은 채널 ID
  const { message, channelId: receivedChannelId } = data;

  addMessageToLocalStorage(receivedChannelId, message);
  socket.chatNamespace.emit('chat-watch-new-message', { channelId: receivedChannelId });
});

socket.authNameSpace.on('add-tab', () => {
  alert('새로운 탭이 열렸습니다.');
  window.close();
});
