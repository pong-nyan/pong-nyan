import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { authNamespace, gameNamespace, chatNamespace, SocketContext } from '@/context/socket';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketContext.Provider value={{authNamespace, gameNamespace, chatNamespace}}>
      <Component {...pageProps} />
    </SocketContext.Provider>
  );
}
