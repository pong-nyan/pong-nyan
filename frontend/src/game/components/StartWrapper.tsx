import { useContext } from 'react';
import CatButton from '@/_components/CatButton';
import { SocketContext } from '@/context/socket';

const GameStartWrapper = () => {
  const socket = useContext(SocketContext);

  <CatButton onClickFunction={() => {
    socket.emit('game-randomStart-rank-pn');
  }} text="Start" width={50} height={42} />;
};

export default GameStartWrapper;