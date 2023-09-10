import { io as socketIOClient } from 'socket.io-client';
import { createContext } from 'react';

export const socket = socketIOClient({ path: '/socket/'});
export const SocketContext = createContext(socket);

// type Item = {
//   intraId: number;
// }

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

