import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { socket, SocketContext } from '../context/socket';
import  AuthProvider from '@/context/AuthProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SocketContext.Provider value={socket}>
        <Component {...pageProps} />
      </SocketContext.Provider>
    </AuthProvider>
  );
}
