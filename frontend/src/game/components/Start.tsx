import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { PlayerNumber, GameStatus } from '@/type/gameType';
import GameStartWrapper from './GameStartWrapper';
import { socketOnGameStartEvent, socketOnGameLoadingEvent } from '@/context/socketGameEvent';
import { SocketId } from '@/type/socketType';

const Start = ({ gameStatus, setGameStatus, setPlayerNumber, setOpponentId }: {
  gameStatus: GameStatus, 
  setGameStatus: Dispatch<SetStateAction<number>>, 
  setPlayerNumber: Dispatch<SetStateAction<PlayerNumber>>, 
  setOpponentId: Dispatch<SetStateAction<SocketId>>
  }) => {
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    socketOnGameStartEvent(setGameStatus, setPlayerNumber, setOpponentId);
    socketOnGameLoadingEvent(setLoading);
  }, [setGameStatus, setPlayerNumber, setOpponentId]);

  return (
    loading ?
      'Loading' :
      <GameStartWrapper gameStatus={gameStatus}/>
  );
}

export default Start;
