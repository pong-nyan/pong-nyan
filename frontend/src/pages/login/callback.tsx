import axios from 'axios';
import { useRouter } from 'next/router';

export default function LoginCallback() {
  const router = useRouter();
  if (router.isReady === false) return (<div>Loading...</div>);
  const code = router.query.code;
  const result = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/login/token?code=${code}`, { withCredentials: true });
  console.log(result);
  return (
    <div>
            Login Callback
    </div>
  );
}