import Run from './Run';
import { Dispatch, SetStateAction, useEffect } from 'react';
import CountDown from './CountDown';
import { PlayerNumber, Score, GameStatus } from '@/type/gameType';
import { SocketId } from '@/type/socketType';
import { Nickname } from '@/type/userType';
import { socketOnGameEnd } from '@/context/socketGameEvent';

const RunWrapper = ({ setGameStatus, playerNumber, opponentId, score, setScore, setNickname }: { 
    setGameStatus: Dispatch<SetStateAction<GameStatus>>, 
    playerNumber: PlayerNumber,
    opponentId: SocketId,
    score: {p1: Score, p2: Score}, 
    setScore: Dispatch<SetStateAction<{p1: Score, p2: Score }>>, 
    setNickname: Dispatch<SetStateAction<{ p1: Nickname, p2: Nickname }>>
  }) => {

  useEffect(() => {
    socketOnGameEnd(setScore, setNickname, setGameStatus);
  }, [setScore, setGameStatus, setNickname]);

  return ( 
    <div style={{ position: 'relative' }}>
      <Run setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1}}>
        <CountDown />
      </div>
    </div>
  );
};

export default RunWrapper;
