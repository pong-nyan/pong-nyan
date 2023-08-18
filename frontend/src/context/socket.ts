import { io as socketIOClient, Socket } from 'socket.io-client';
import { createContext } from 'react';

export const socket = socketIOClient(process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost/api');
export const SocketContext = createContext(socket);
