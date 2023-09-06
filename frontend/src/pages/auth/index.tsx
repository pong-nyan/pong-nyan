import FortyTwoIntraSignInButton from '../../auth/components/FortyTwoIntraSignInButton';
import MyPageButton from '@/chat/components/MyPageButton';
import styles from './styles/Login.module.css';

export default function Login() {
  return (
    <>
      <div className={styles.loginContainer}>
        <FortyTwoIntraSignInButton />
        <MyPageButton />
      </div>
    </>
  );
}