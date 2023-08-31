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
        console.log(res)
        if (res.status === 200 && res.data.redirectUrl) {
          router.push(res.data.redirectUrl);
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
