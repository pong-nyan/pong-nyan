import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { socket, SocketContext } from '../context/socket';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketContext.Provider value={socket}>
      <Component {...pageProps} />
    </SocketContext.Provider>
  );
}
