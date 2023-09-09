import { useEffect, useState } from 'react';
import useNotAuth from '@/context/useNotAuth';
import { useGetFetchDataRedirect } from '@/context/useGetFetchData';
import useRedirect from '@/context/useRedirect';

const SignIn = () => {
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  useNotAuth();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`;
  const getFetchData = useGetFetchDataRedirect(url);

  useEffect(() => {
    const fetchData = async () => {
      const output = await getFetchData();
      setRedirectUrl(output);
    };
    fetchData();
  });

  useRedirect(redirectUrl);

  return (
    <p>signin</p>
  );
};

export default SignIn;
