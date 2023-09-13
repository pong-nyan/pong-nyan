import No2FA from '@/auth/components/No2FA';
import styles from '@/auth/styles/No2FA.module.css';
import useNotAuth from '@/context/useNotAuth';

const No2FAPage = () => {
  useNotAuth();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        2차 인증을 사용할 것을 권장합니다. 
        <br/>
        프로필페이지에서 2차인증을 활성화해주세요.
      </h1>
      <No2FA />
    </div>
  );
};

export default No2FAPage;
