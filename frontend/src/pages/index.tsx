import { socket, SocketContext } from '../context/socket';

export default function Home() {
  return (
    <SocketContext.Provider value={socket}>
      <h1>Hello World</h1>
    </SocketContext.Provider>
  )
}
