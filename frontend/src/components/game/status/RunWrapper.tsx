import Run from '@/components/game/status/Run';
import { PlayerNumber, Score } from '@/type';
import { Dispatch, SetStateAction, useState } from 'react';

const RunWrapper = ({ setGameStatus, playerNumber, opponentId, score, setScore}
    : { setGameStatus: Dispatch<SetStateAction<number>>, playerNumber: PlayerNumber, opponentId: string, score: Score, setScore: Dispatch<SetStateAction<Score>> } ) => {
  return (
    <div>
      <Run setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore}/>
    </div>
  );
};

export default RunWrapper;