import axios from 'axios';
import { useState } from 'react';

const RequestBlockInProfile = ({ nickname }: { nickname: string }) => {
  const [info, setInfo] = useState<string>('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!nickname) {
      setInfo('차단을 실패했습니다. 차단할 닉네임을 입력해주세요.');
      return;
    }
    if (nickname === JSON.parse(localStorage.getItem('user') || '{}').nickname) {
      setInfo('자기자신을 차단할 수 없습니다.');
      return;
    }
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/block`, { nickname }
    ).then(() => {
      setInfo('차단을 성공했습니다.');
    }).catch((error) => {
      if (error?.response?.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('user');
        location.replace('/auth');
        return ;
      }
      setInfo(`차단을 실패했습니다. ${error.response.data.message}`);
    }
    );
  };

  return (
    <>
      {info}
      {!info && <button onClick={handleSubmit}>유저차단</button>}
    </>
  );
};

export default RequestBlockInProfile;
