import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useNotAuth from '@/context/useNotAuth';

const SignIn = () => {
  useNotAuth();
  const router = useRouter();
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, { withCredentials: true })
      .then((res) => {
        if (res.data === 'goto 2fa') {
          router.push('/auth/google-2fa-verify');
        }
      }).catch((error) => {
        console.error(error);
        alert(`Sign In error: ${error.response.data}`);
      });
  }, []);
  return (
    <p>signin</p>
  );
};

export default SignIn;
