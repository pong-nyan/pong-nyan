import Run from '@/components/game/status/Run';
import { PlayerNumber, Score } from '@/type';
import { Dispatch, SetStateAction } from 'react';
import CountDown from '../CountDown';

const RunWrapper = ({ setGameStatus, playerNumber, opponentId, score, setScore}
    : { setGameStatus: Dispatch<SetStateAction<number>>, playerNumber: PlayerNumber, opponentId: string, score: Score, setScore: Dispatch<SetStateAction<Score>> } ) => {
  return (
    <div style={{ position: 'relative' }}>
      <Run setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <CountDown />
      </div>
    </div>

  );
};

export default RunWrapper;