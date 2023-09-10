import { RankUserProps } from '@/type/rankType';
import styles from '@/rank/styles/Rank.module.css';

const RankUser = ({ rankUser, rank }: RankUserProps) => {
  return (
    <div className={styles.rankUser}>
      <p>{rank}</p>
      <p>{rankUser.rankScore}</p>
      <p>{rankUser.nickname}</p>
    </div>
  );
};

export default RankUser;