import { Dispatch, SetStateAction } from 'react';
import Run from './Run';
import CountDown from './CountDown';
import { PlayerNumber, Score, GameStatus } from '@/type/gameType';

const RunWrapper = ({ gameStatus, setGameStatus, playerNumber, opponentId, score, setScore}
    : { gameStatus: GameStatus, setGameStatus: Dispatch<SetStateAction<number>>, playerNumber: PlayerNumber | undefined, opponentId: string | undefined, score: Score, setScore: Dispatch<SetStateAction<Score>> } ) => {

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
