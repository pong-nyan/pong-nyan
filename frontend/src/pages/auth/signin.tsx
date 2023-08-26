import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const SignIn = () => {
  //  auto signin
  const router = useRouter();
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, { withCredentials: true })
      .then((res) => {
        console.log('res', res);
        localStorage.setItem('user', JSON.stringify(res.data));
        router.replace('/');
      }).catch((error) => {
        console.log(error);
        alert(`Sign In error: ${error.response.data}`);
      });
  }, []);
  return (
    <p>signin</p>
  );
};

export default SignIn;
    