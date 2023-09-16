import axios from 'axios';
import { useContext, useEffect } from 'react';
import { SocketContext } from '@/context/socket';
import { socketEmitChatCreateDmEvent, socketOnChatCreateDmEvent, socketOffChatCreateDmEvent } from '@/context/socketChatEvent';

/**
 * @description DM을 보내는 컴포넌트
 * @param {string} nickname - DM을 보낼 상대방의 닉네임
 * @returns {JSX.Element} DM을 보내는 버튼
 */
const DirectMessageInProfile = ({ nickname }: { nickname: string }) => {

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!nickname) {
      alert('nickname이 정상적이지 않습니다.');
      return;
    }
    if (nickname === JSON.parse(localStorage.getItem('user') || '{}').nickname) {
      alert('자기 자신에게 DM을 보낼 수 없습니다.');
      return;
    } 
    socketEmitChatCreateDmEvent(nickname);
  };

  useEffect(() => {
    socketOnChatCreateDmEvent();
    return () => {
      socketOffChatCreateDmEvent();
    }
  }, []);
  
  return (
    <>
      <button onClick={handleSubmit}>DM</button>
    </>
  );
};

export default DirectMessageInProfile;
