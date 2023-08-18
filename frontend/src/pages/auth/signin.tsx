import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const SignIn = () => {
  //  auto signin
  const router = useRouter();
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, { withCredentials: true })
      .then(() => {
        router.replace('/');
      });
  }, []);

  return (
    <p>signin</p>
  );
};

export default SignIn;
    