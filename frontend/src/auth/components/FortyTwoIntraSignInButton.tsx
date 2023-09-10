import { useRouter } from 'next/router';
import redirect42Oauth  from '@/auth/logic/redirectOauth';
import styles from '@/auth/styles/Login.module.css';

const FortyTwoIntraSignInButton = () => {
  const router = useRouter();
  
  return (
    <button onClick={() => redirect42Oauth(router)} className={styles.signUpButton}>42 Sign In</button>
  );
};

export default FortyTwoIntraSignInButton;
