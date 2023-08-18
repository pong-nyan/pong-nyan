import SignUpButton from './SignUpButton';
import SignInButton from './SignInButton';
import styles from '../../styles/Login.module.css';

export default function Login() {
  return (
    <>
      <div className={styles.loginContainer}>
        <SignInButton />
        <SignUpButton />
      </div>
    </>
  );
}