import { io as socketIOClient } from 'socket.io-client';
import { createContext } from 'react';

export const socket = socketIOClient({ path: '/socket/'});
export const SocketContext = createContext(socket);
