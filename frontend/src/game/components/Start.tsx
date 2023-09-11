import { Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import { SocketContext } from '@/context/socket';
import { PlayerNumber, GameStatus, RoomName } from '@/type/gameType';
import GameStartWrapper from './GameStartWrapper';

export default function Start({ gameStatus, setGameStatus, setPlayerNumber, setOpponentId }
  : { gameStatus: GameStatus, setGameStatus: Dispatch<SetStateAction<number>>, setPlayerNumber: Dispatch<SetStateAction<PlayerNumber | undefined>>, setOpponentId: Dispatch<SetStateAction<string | undefined>>}) {
  const socket = useContext(SocketContext);
  const [ loading, setLoading ] = useState(false);

  // TODO: 추후 rank - origin, normal - origin 의 경우의 수에 따라 socket.on 을 추가해야 함
  socket.on('game-start', ({ player1Id, player2Id }: {roomName: RoomName, player1Id: string, player2Id: string}) => {
    if (socket.id === player1Id) { 
      setPlayerNumber('player1');
      setOpponentId(player2Id);
    }
    else if (socket.id == player2Id){
      setPlayerNumber('player2');
      setOpponentId(player1Id);
    }
    setGameStatus(GameStatus.RankPnRun);
  });
  socket.on('game-loading', () => {
    setLoading(true);
  });

  return (
    loading ?
      'Loading' :
      <GameStartWrapper gameStatus={gameStatus}/>
  );
}
