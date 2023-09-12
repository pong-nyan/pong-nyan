import { io as socketIOClient } from 'socket.io-client';
import { createContext } from 'react';
import { addMessageToLocalStorage } from '@/chat/utils/chatLocalStorage';

export const socket = socketIOClient({ path: '/socket/'});
export const SocketContext = createContext(socket);

socket.on('auth-set-map-payload', () => {
  const user = localStorage.getItem('user');
  if (!user) {
    console.log('user null');
    return ;
  }
  const item = JSON.parse(user);
  console.log('auth-set-map-payload item', item);
  socket.emit('auth-set-map', { intraId: item.intraId });
});

// 메시지를 받아서 로컬 스토리지에 저장
socket.on('chat-new-message', (data) => {
  console.log('[Chat] chat-new-message', data);
  const { message, channelId: receivedChannelId, sender } = data;

  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const loggedInUserId = loggedInUser.intraId;
  if (sender === loggedInUserId) {
    console.log('[Chat] myMessage sender, loggedInUserId', sender, loggedInUserId);
    return;
  }
  addMessageToLocalStorage(receivedChannelId, message);
});

socket.on('add-tab', () => {
  alert('새로운 탭이 열렸습니다.');
  window.close();
});
