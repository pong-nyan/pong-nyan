import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LoginCallback = () => {
  const router = useRouter();
  // const [isClient, setIsClient] = useState(false)
  // useEffect(() => {
  //   setIsClient(true)
  // }, [])
  const code = router.query.code;

  useEffect(() => {
    if (code) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/token?code=${code}`, { withCredentials: true })
        .then((res) => {
          if (res.data === 'goto signup') {
            router.replace('/auth/signup');
          } else if (res.data === 'goto signin') {
            router.replace('/auth/signin');
          } else if (res.data === 'goto qr') {
            router.replace('/auth/qr');
          }
        })
        .catch((error) => {
          console.error('Login Redirect error:', error);
        });
    }
  }, [code]);

  return (
    <div>
      Login Callback
    </div>
  );
};

export default LoginCallback;
