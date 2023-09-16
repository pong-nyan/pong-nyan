import Start from '@/game/components/Start';
import End from '@/game/components/End';
import { PlayerNumber, Score, GameStatus } from '@/type/gameType';
import { Nickname } from '@/type/userType';
import { SocketId } from '@/type/socketType';
import { useState } from 'react';
import useAuth from '@/context/useAuth';
import RunWrapper from '@/game/components/RunWrapper';

const Game = () => {
  useAuth();
  // TODO: start game button
  // FIXME: game status
  const [gameStatus, setGameStatus] =  useState(0);
  const [playerNumber, setPlayerNumber] = useState<PlayerNumber>('');
  const [opponentId, setOpponentId] = useState<SocketId>('');
  const [score, setScore] = useState<{ p1: Score, p2: Score }>({p1: 0, p2: 0});
  const [nickname, setNickname] = useState<{ p1: Nickname, p2: Nickname }>({p1: '지민', p2: '미킴'});

  switch (gameStatus) {
  case GameStatus.Start:
    return (<Start setGameStatus={setGameStatus} setPlayerNumber={setPlayerNumber} setOpponentId={setOpponentId} />);
  case GameStatus.RankPnRun:
    return (<RunWrapper gameStatus={gameStatus} setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore} setNickname={setNickname} />);
  case GameStatus.NormalPnRun:
    return (<RunWrapper gameStatus={gameStatus} setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore} setNickname={setNickname} />);
  case GameStatus.RankOriginRun:
    return (<RunWrapper gameStatus={gameStatus} setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore} setNickname={setNickname} />);
  case GameStatus.NormalOriginRun:
    return (<RunWrapper gameStatus={gameStatus} setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore} setNickname={setNickname} />);
  case GameStatus.End:
    return (<End setGameStatus={setGameStatus} score={score} setScore={setScore} nickname={nickname} />);
  default:
    return (<h1>ERROR!</h1>);
  }
};

export default Game;
