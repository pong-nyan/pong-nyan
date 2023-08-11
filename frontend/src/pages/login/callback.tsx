import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'

const LoginCallback = () => {
  const router = useRouter();
  // const [isClient, setIsClient] = useState(false)
  // useEffect(() => {
  //   setIsClient(true)
  // }, [])
  const code = router.query.code;
  axios.get(`${process.env.NEXT_PUBLIC_API_URL}/login/token?code=${code}`, { withCredentials: true });

  return (
    <div>
      Login Callback
    </div>
  );
}

export default LoginCallback;