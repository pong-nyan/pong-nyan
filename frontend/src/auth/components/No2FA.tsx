import axios from 'axios';
import useNotAuth from '@/context/useNotAuth';
import { SocketContext } from '@/context/socket';
import { useContext } from 'react';

const No2FA = () => {
  useNotAuth();
  const { authNamespace } = useContext(SocketContext);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/no2fa-signin`, {}, { withCredentials: true }).then(
      (res) => {
        if (res.status === 202) {
          localStorage.setItem('user', JSON.stringify(res.data));
          console.log('Emitting auth-set-map');
          authNamespace.emit('auth-set-map');
          location.replace('/');
        }
      }
    ).catch((err) => {
      if (err?.response?.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('user');
        location.replace('/auth');
      }
      console.error(err);
    });
  };

  return (
    <button onClick={ handleSubmit }>2차 인증없이 로그인</button>
  );
};

export default No2FA;