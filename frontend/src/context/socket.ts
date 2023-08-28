import { io as socketIOClient } from 'socket.io-client';
import { createContext } from 'react';

const socket = socketIOClient({ path: '/socket/'});

// TODO : for development only
socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
export const SocketContext = createContext(socket);
