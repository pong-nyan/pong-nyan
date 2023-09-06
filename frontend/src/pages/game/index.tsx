import Start from '@/game/components/Start';
import RunWrapper from '@/game/components/RunWrapper';
import End from '@/game/components/End';
import { PlayerNumber, Score } from '@/game/gameType';
import { useState } from 'react';

enum GameStatus {
	Start,
	Run,
	End
}

export default function Game(): JSX.Element {
  // TODO: start game button
  // FIXME: game status
  const [gameStatus, setGameStatus] =  useState(0);
  const [playerNumber, setPlayerNumber] = useState<PlayerNumber>();
  const [opponentId, setOpponentId] = useState<string>();
  const [score, setScore] = useState<Score>({p1: 0, p2: 0});

  switch (gameStatus) {
  case GameStatus.Start:
    return (<Start setGameStatus={setGameStatus} setPlayerNumber={setPlayerNumber} setOpponentId={setOpponentId} />);
  case GameStatus.Run:
    return (<RunWrapper setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore}/>);
  case GameStatus.End:
    return (<End setGameStatus={setGameStatus} setPlayerNumber={setPlayerNumber} />);
  default:
    return (<h1>ERROR!</h1>);
  }
}

