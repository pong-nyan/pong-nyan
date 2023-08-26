enum GameStatus {
	Start,
	Run,
	End
}

import Start from '../../components/game/status/Start';
import Run from '../../components/game/status/Run';
import End from '../../components/game/status/End';
import { PlayerNumber } from '../../type';

// 0 start 1 run 2 end
import { useState } from 'react';
export default function Game(): JSX.Element {
  // TODO: start game button
  // FIXME: game status
  const [gameStatus, setGameStatus] =  useState(0);
  const [playerNumber, setPlayerNumber] = useState<PlayerNumber>();
  const [opponentId, setOpponentId] = useState<string>();

  switch (gameStatus) {
  case GameStatus.Start:
    return (<Start setGameStatus={setGameStatus} setPlayerNumber={setPlayerNumber} setOpponentId={setOpponentId} />);
  case GameStatus.Run:
    return (<Run setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} />);
  case GameStatus.End:
    return (<End setGameStatus={setGameStatus} setPlayerNumber={setPlayerNumber} />);
  default:
    return (<h1>ERROR!</h1>);
  }
}

