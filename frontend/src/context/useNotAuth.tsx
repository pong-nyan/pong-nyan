import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useNotAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user') ?? JSON.stringify({ exp: 0 });
    const { exp } = JSON.parse(user);
    if (user && exp * 1000 > Date.now()) {
      router.push('/');
      alert('You are already signed in.');
      return;
    }
  }, [router]);
};

export default useNotAuth;
