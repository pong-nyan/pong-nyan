import { RankUserProps } from '@/type/rankType';
import styles from '@/rank/styles/Rank.module.css';
import Link from 'next/link';

const RankUser = ({ rankUser, rank }: RankUserProps) => {
  return (
    <div className={styles.rankUser}>
      <p>{rank}</p>
      <p>{rankUser.rankScore}</p>
      <p>
        <Link href={`/profile/${rankUser.nickname}`}>
          {rankUser.nickname}
        </Link>
      </p>
    </div>
  );
};

export default RankUser;