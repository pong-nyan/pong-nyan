import FortyTwoIntraSignInButton from '../../auth/components/FortyTwoIntraSignInButton';
import styles from '@/auth/styles/Login.module.css';

export default function Login() {
  return (
    <>
      <div className={styles.loginContainer}>
        <FortyTwoIntraSignInButton />
      </div>
    </>
  );
}
