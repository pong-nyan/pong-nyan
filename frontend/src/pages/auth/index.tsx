import SignUpButton from '../../components/button/SignUpButton';
import MyPageButton from '@/components/button/MyPageButton';
import styles from '../../styles/Login.module.css';

export default function Login() {
  return (
    <>
      <div className={styles.loginContainer}>
        <SignUpButton />
        <MyPageButton />
      </div>
    </>
  );
}