import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '@/context/socket';
import { GameStatus, PlayerNumber } from '@/type/gameType';
import { socketOffGameStartEvent, socketOnGameStartEvent } from '@/context/socketGameEvent';
import End from '@/game/components/End';
import RunWrapper from '@/game/components/RunWrapper';

const Matching = ({ nickname }: { nickname: string }) => {
  const { gameNamespace } = useContext(SocketContext);
  const [friendGame, setGameStatus] =  useState(0);
  const [playerNumber, setPlayerNumber] = useState<PlayerNumber>('');
  const [opponentId, setOpponentId] = useState('');
  const [score, setScore] = useState<{ p1: number, p2: number }>({p1: 0, p2: 0});
  const [gameNickname, setGameNickname] = useState<{ p1: string, p2: string }>({p1: '지민', p2: '미킴'});

  const startMatching = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('로그인을 해주세요.');
      return;
    }
    const myNickname = JSON.parse(user).nickname;
    if (myNickname === nickname) {
      alert('자기자신에게는 매칭을 할 수 없습니다.');
      return;
    }
    alert(`${nickname} 에게 게임신청, 상대도 매칭시작을 눌러야 게임을시작합니다.`);
    setGameStatus(1);
    // in game-friendStart, gameStatus is NormalPnRun is possible, other would be ignored
    gameNamespace.emit('game-friendStart', { gameStatue: GameStatus.NormalPnRun, friendNickname: nickname });    
  };
  useEffect(() => {
    socketOnGameStartEvent(setGameStatus, setPlayerNumber, setOpponentId);
    return () => {
      socketOffGameStartEvent();
    };
  }, [setGameStatus, setPlayerNumber, setOpponentId]);

  if (friendGame === 0) {
    return (
      <div>
        <button type="button" onClick={startMatching}>매칭 시작</button>
      </div>
    );}
  else if (friendGame === 1) {
    return (
      <div>
        wait for {nickname} to start game
      </div>
    );
  } else if (friendGame === 2) {
    return (
      <RunWrapper gameStatus={GameStatus.NormalPnRun} setGameStatus={setGameStatus} playerNumber={playerNumber} opponentId={opponentId} score={score} setScore={setScore} setNickname={setGameNickname} />
    );  
  } else if (friendGame === GameStatus.End) {
    return (
      <End setGameStatus={setGameStatus} score={score} setScore={setScore} nickname={gameNickname} />
    );
  }
};

export default Matching;