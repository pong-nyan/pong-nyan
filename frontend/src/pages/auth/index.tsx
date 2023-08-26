import SignUpButton from '../../components/button/SignUpButton';
import SignInButton from '../../components/button/SignInButton';
import MyPageButton from '@/components/button/MyPageButton';
import styles from '../../styles/Login.module.css';

export default function Login() {
  return (
    <>
      <div className={styles.loginContainer}>
        <SignInButton />
        <SignUpButton />
        <MyPageButton />
      </div>
    </>
  );
}