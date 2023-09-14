import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { PlayerNumber } from '@/type/gameType';
import GameStartWrapper from './GameStartWrapper';
import { socketOnGameStartEvent, socketOnGameLoadingEvent, socketOffGameStartEvent } from '@/context/socketGameEvent';
import { SocketId } from '@/type/socketType';
import NavButtonWrapper from '@/_components/NavButtonWrapper';
import GameLoading from './GameLoading';


const Start = ({setGameStatus, setPlayerNumber, setOpponentId }: {
  setGameStatus: Dispatch<SetStateAction<number>>, 
  setPlayerNumber: Dispatch<SetStateAction<PlayerNumber>>, 
  setOpponentId: Dispatch<SetStateAction<SocketId>>
  }) => {
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    socketOnGameLoadingEvent(setLoading);
    socketOnGameStartEvent(setGameStatus, setPlayerNumber, setOpponentId);
    return () => {
      socketOffGameStartEvent();
    };
  }, [setGameStatus, setPlayerNumber, setOpponentId]);

  return (
    loading ?
      <div>
        <GameLoading />
        <NavButtonWrapper />
      </div>
      :
      <div>
        <GameStartWrapper />
        <NavButtonWrapper />
      </div>
  );
}

export default Start;
