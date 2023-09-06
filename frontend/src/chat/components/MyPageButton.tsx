import Link from 'next/link';
import styles from '../../styles/User.module.css';

export default function MyPageButton() {
  return (
    <Link href="/auth/mypage">
      <button className={styles.myPageButton}>MyPage</button>
    </Link>
  );
}
