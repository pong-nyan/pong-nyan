import { useRouter } from 'next/router';
import redirectOauth  from '@/auth/logic/redirectOauth';
import styles from '@/auth/styles/Login.module.css';

const FortyTwoIntraSignInButton = () => {
  const router = useRouter();
  
  return (
    <button onClick={() => redirectOauth(router)} className={styles.signUpButton}>42 Sign In</button>
  );
};

export default FortyTwoIntraSignInButton;
