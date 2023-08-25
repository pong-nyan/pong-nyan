import { useRouter} from 'next/router';
import styles from '../../styles/Login.module.css';

export default function SignInButton() {
  const router = useRouter();
  
  return (
    <button  className={styles.signInButton} onClick={()=>router.push('auth/signin')} >Sign In</button>
  );
}