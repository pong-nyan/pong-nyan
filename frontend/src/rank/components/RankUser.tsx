import { RankUserProps } from '../rankType';
import styles from '@/rank/styles/Rank.module.css';

const RankUser = ({ rankUser, rank }: RankUserProps) => {
  return (
    <div className={styles.rankUser}>
      <p>{rank}</p>
      <p>{rankUser.rankScore}</p>
      <p>{rankUser.intraNickname}</p>
    </div>
  );
};

export default RankUser;