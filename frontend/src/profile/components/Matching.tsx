import { useContext } from 'react';
import { SocketContext } from '@/context/socket';

const Matching = ({ nickname }: { nickname: string}) => {
  const socket = useContext(SocketContext);
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
    socket.gameNamespace.emit('game-friendStart', { nickname });    
  };

  return (
    <div>
      <button type="button" onClick={startMatching}>매칭 시작</button>
    </div>
  );
};

export default Matching;