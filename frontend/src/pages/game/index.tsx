enum GameStatus {
	Start,
	Run,
	End
}

import Start from '../../components/game/status/Start';
import Run from '../../components/game/status/Run';
import End from '../../components/game/status/End';

// 0 start 1 run 2 end
import { useState } from 'react';
export default function Game(): JSX.Element {
  // TODO: start game button
  const [gameStatus, setGameStatus] = useState(1);

  switch (gameStatus) {
  case GameStatus.Start:
    return (<Start setGameStatus={setGameStatus} />);
  case GameStatus.Run:
    return (<Run setGameStatus={setGameStatus} />);
  case GameStatus.End:
    return (<End setGameStatus={setGameStatus} />);
  default:
    return (<h1>ERROR!</h1>);
  }
}
