import styles from '../../styles/Login.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

const SignUpButton = () => {
  const router = useRouter();
  const signUp = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`);
    if (res.status === 200) {
      if (res.data === 'goto signup') {
        router.push('/auth/user-before-signup');
      } else if (res.data === 'goto signin') {
        alert('You have already signed up. Please sign in.');
        router.push('/auth/signin');
      }
    }
  };
  return (
    <button onClick={signUp} className={styles.signUpButton}>Sign Up</button>
  );
};

export default SignUpButton;