import FortyTwoIntraSignInButton from '../../components/button/FortyTwoIntraSignInButton';
import MyPageButton from '@/components/button/MyPageButton';
import styles from '../../styles/Login.module.css';

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