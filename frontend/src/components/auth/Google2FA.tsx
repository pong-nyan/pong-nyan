import axios from 'axios';
import { useRouter } from 'next/router';
import useNotAuth from '@/context/useNotAuth';

const Google2FA = () => {
  useNotAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = e.currentTarget.code.value;
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/google2fa/enable`, { code }, { withCredentials: true })
      .then((res) => {
        console.log('res', res);
        console.log('res.data', res.data);

        if (res.status === 200) {
          localStorage.setItem('user', JSON.stringify(res.data));
          router.replace('/');
        }
      }
      ).catch((err) => {
        console.log(err);
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
