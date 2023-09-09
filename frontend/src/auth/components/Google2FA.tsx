import axios from 'axios';
import { useRouter } from 'next/router';
import useNotAuth from '@/context/useNotAuth';
import { socket } from '@/context/socket';

const Google2FA = () => {
  useNotAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = e.currentTarget.code.value;
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/google2fa/enable`, { code }, { withCredentials: true })
      .then((res) => {
        if (res.status === 202) {
          localStorage.setItem('user', JSON.stringify(res.data));
          socket.emit('auth-set-map', { intraId : res.data.intraId });
          router.replace('/');
        }
      }
      ).catch((err) => {
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
