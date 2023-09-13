import axios from 'axios';
import { useRouter } from 'next/router';
import useNotAuth from '@/context/useNotAuth';
import { SocketContext } from '@/context/socket';
import { useContext } from 'react';

const Google2FA = () => {
  useNotAuth();
  const socket = useContext(SocketContext);
  const router = useRouter();

  const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = e.currentTarget.code.value;
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/google2fa/enable`, { code }, { withCredentials: true })
      .then((res) => {
        if (res.status === 202) {
          localStorage.setItem('user', JSON.stringify(res.data));
          console.log('Emitting auth-set-map');
          socket.authNameSpace.emit('auth-set-map');
          location.replace('/');
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert('Enable failed. Please try again.');
        }
      }
      );
  };

  return (
    <form onSubmit={ handleSubmit }>
      <input type='text' name='code' placeholder='Enter code' />
      <button type='submit'>Submit</button>
    </form>
  );
};

export default Google2FA;
