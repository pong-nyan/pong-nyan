import Start from '@/game/components/Start';
import RunWrapper from '@/game/components/RunWrapper';
import End from '@/game/components/End';
import { PlayerNumber, Score, GameStatus } from '@/type/gameType';
import { useState, useEffect, useContext } from 'react';
import useAuth from '@/context/useAuth';

export default function Game(): JSX.Element {
  useAuth();
  // TODO: start game button
  // FIXME: game status
  const [gameStatus, setGameStatus] =  useState(0);
  const [playerNumber, setPlayerNumber] = useState<PlayerNumber>();
  const [opponentId, setOpponentId] = useState<string>();
  const [score, setScore] = useState<Score>({p1: 0, p2: 0});

  switch (gameStatus) {
  case GameStatus.Start:
    return (<Start gameStatus={gameStatus} setGameStatus={setGameStatus} setPlayerNumber={setPlayerNumber} setOpponentId={setOpponentId} />);
  // TODO: 각  모드에 맞게  수정  필요
  case GameStatus.RankPnRun:
    return (<RunWrapper setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore}/>);
  case GameStatus.NormalPnRun:
    return (<RunWrapper setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore}/>);
  case GameStatus.RankOriginRun:
    return (<RunWrapper setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore}/>);
  case GameStatus.NormalOriginRun:
    return (<RunWrapper setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore}/>);
  case GameStatus.End:
    return (<End setGameStatus={setGameStatus} setPlayerNumber={setPlayerNumber} />);
  default:
    return (<h1>ERROR!</h1>);
  }
}

