import { io as socketIOClient } from 'socket.io-client';
import { createContext } from 'react';
import { addMessageToLocalStorage } from '@/chat/utils/chatLocalStorage';

export const authNamespace = socketIOClient('/auth', { path: '/socket/'});
export const gameNamespace = socketIOClient('/game', { path: '/socket/'});
export const chatNamespace = socketIOClient('/chat', { path: '/socket/'});

export const SocketContext = createContext({
  authNamespace,
  gameNamespace,
  chatNamespace
});

authNamespace.on('auth-set-map-payload', () => {
  const user = localStorage.getItem('user');
  if (!user) {
    console.log('user null');
    return ;
  }
  const item = JSON.parse(user);
  console.log('auth-set-map-payload item', item);
  authNamespace.emit('auth-set-map', { intraId: item.intraId });
});

// 메시지를 받아서 로컬 스토리지에 저장
chatNamespace.on('chat-new-message', (data) => {
  console.log('[Chat] chat-new-message', data);
  // 메시지를 받은 채널 ID
  const { message, channelId: receivedChannelId } = data;

  addMessageToLocalStorage(receivedChannelId, message);
  chatNamespace.emit('chat-watch-new-message', { channelId: receivedChannelId });
});

chatNamespace.on('add-tab', () => {
  location.replace('/');
  alert('새로운 탭이 열렸습니다. 하나의 탭만 남겨주세요.');
});
gameNamespace.on('add-tab', () => {
  location.replace('/');
  alert('새로운 탭이 열렸습니다. 하나의 탭만 남겨주세요.');
});
