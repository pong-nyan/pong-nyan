import { collectGenerateParams } from 'next/dist/build/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAuth = () => {
  const router = useRouter();
  const isLoggedIn = true;

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth');
      alert('Please sign in.');
      return;
    }
    const { exp } = JSON.parse(user);
    if (exp * 1000 < Date.now()) {
      router.push('/auth');
      alert('Please sign in again.');
      return;
    }
  }, [router]);

};

export default useAuth;
