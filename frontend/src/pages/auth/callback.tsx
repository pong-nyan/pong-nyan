import { useRouter } from 'next/router';
import useRedirect from '../../context/useRedirect';
import { useEffect, useState } from 'react';
import { useGetFetchDataRedirect } from '@/context/useGetFetchData';

const LoginCallback = () => {
  const router = useRouter();
  const code = router.query.code;
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const url =  code ? `${process.env.NEXT_PUBLIC_API_URL}/auth/token?code=${code}`: null;
  const getFetchData = useGetFetchDataRedirect(url);

  useEffect(() => {
    const fetchData = async () => {
      const output = await getFetchData();
      setRedirectUrl(output);
    };
    fetchData();
  }, [code]);
  useRedirect(redirectUrl);

  return (
    <div>
      Login Callback
    </div>
  );
};

export default LoginCallback;
