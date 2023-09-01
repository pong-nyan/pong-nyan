import { useRouter } from 'next/router';
import useRedirect from '../../context/useRedirect';

const LoginCallback = () => {
  const router = useRouter();
  const code = router.query.code;

  const url =  code ? `${process.env.NEXT_PUBLIC_API_URL}/auth/token?code=${code}` : null;
  useRedirect(router, url, 'get');

  return (
    <div>
      Login Callback
    </div>
  );
};

export default LoginCallback;
