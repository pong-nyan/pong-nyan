import styles from '@/auth/styles/Login.module.css';
import { useRouter } from 'next/router';

const FortyTwoIntraSignInButton = () => {
  const router = useRouter();
  
  const redirectOauth = () => {
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    router.push(
      `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
    );
  };
  return (
    <button onClick={redirectOauth} className={styles.signUpButton}>42 Sign In</button>
  );
};

export default FortyTwoIntraSignInButton;
