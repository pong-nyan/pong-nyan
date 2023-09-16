import axios from 'axios';
import { useState } from 'react';

const RequestFriendInProfile = ({ nickname }: { nickname: string }) => {
  const [info, setInfo] = useState<string>('');
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!nickname) {
      setInfo('친구요청을 실패했습니다. 친구닉네임을 입력해주세요.');
      return;
    }
    if (nickname === JSON.parse(localStorage.getItem('user') || '{}').nickname) {
      setInfo('자기자신에게는 친구요청을 할 수 없습니다.');
      return;
    }
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/request`,
      {
        friendNickname: nickname
      }).then(() => {
      setInfo('친구요청을 성공했습니다.');
    }).
      catch((error) => {
        setInfo(`친구요청을 실패했습니다. ${error.response.data.message}`);
      }
      );
  };

  return (
    <>
      {info}
      {!info && <button onClick={handleSubmit}>친구요청</button>}
    </>
  );
};

export default RequestFriendInProfile;