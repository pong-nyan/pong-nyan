import { RankUserProps } from '../rankType';
import styles from '@/rank/styles/Rank.module.css';

const RankUser = ({ rankUser }: RankUserProps) => {
  return (
    <div className={styles.rankUser}>
      <p>{rankUser.rank}</p>
      <p>{rankUser.rankScore}</p>
      <p>{rankUser.nickname}</p>
    </div>
  );
};

export default RankUser;