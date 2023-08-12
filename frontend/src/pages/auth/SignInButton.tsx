import { useRouter } from 'next/router';
import styles from '../../styles/Login.module.css';

export default function SignInButton() {
  const router = useRouter();
  const loginWithRedirect = () => {
    const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    router.push(
      `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
    );
  };

  return (
    <button onClick={loginWithRedirect} className={styles.signInButton} >Sign In</button>
  );
}