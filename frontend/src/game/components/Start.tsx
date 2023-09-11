import { Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import { PlayerNumber, GameStatus } from '@/type/gameType';
import GameStartWrapper from './GameStartWrapper';
import { socketOnGameStartEvent, socketOnGameLoadingEvent } from '@/context/socketGameEvent';
import { SocketId } from '@/type/socketType';

export default function Start({ gameStatus, setGameStatus, setPlayerNumber, setOpponentId }
  : { gameStatus: GameStatus, setGameStatus: Dispatch<SetStateAction<number>>, setPlayerNumber: Dispatch<SetStateAction<PlayerNumber>>, setOpponentId: Dispatch<SetStateAction<SocketId>>}) {
  const [ loading, setLoading ] = useState(false);

  // TODO: 추후 rank - origin, normal - origin 의 경우의 수에 따라 socket.on 을 추가해야 함
  socketOnGameStartEvent(setGameStatus, setPlayerNumber, setOpponentId);
  socketOnGameLoadingEvent(setLoading);

  return (
    loading ?
      'Loading' :
      <GameStartWrapper gameStatus={gameStatus}/>
  );
}
