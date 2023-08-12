import styles from '../../styles/Login.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

const SignUpButton = () => {
  const router = useRouter();
  const signUp = () => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
    }).then(res => {
      if (res.status === 201) {
        alert('Sign up successful');
        // TODO: redirect to user into settings page
      } else {
        alert('you are already signed up');
        router.push('/login');
      }
    }).catch(err => {
      console.error(err);
    });
  };
  return (
    <button onClick={signUp} className={styles.signUpButton}>Sign Up</button>
  );
};

export default SignUpButton;