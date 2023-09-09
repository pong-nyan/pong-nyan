import { useContext, Dispatch, SetStateAction } from 'react';
import CatButton from '@/_components/CatButton';
import { SocketContext } from '@/context/socket';

const GameStartWrapper = ({ setGameStatus, setPlayerNumber, setOpponentId }
  : { setGameStatus: Dispatch<SetStateAction<number>>, setPlayerNumber: Dispatch<SetStateAction<PlayerNumber | undefined>>, setOpponentId: Dispatch<SetStateAction<string | undefined>>}
) => {
  const socket = useContext(SocketContext);

  <CatButton onClickFunction={() => {
    socket.emit('game-randomStart-rank-pn');
  }} text="Start" width={50} height={42} />;
};

export default GameStartWrapper;