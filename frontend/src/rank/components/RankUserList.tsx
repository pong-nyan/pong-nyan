import RankUser from './RankUser';
import { RankUserListProps } from '../rankType';
import styles from '@/rank/styles/Rank.module.css';

const RankUserList = ({ rankUserList } : RankUserListProps) => {
  return (
    <div className={styles.rankUserList}>
      <RankUserColumn />
      {rankUserList.map((rankUser) => (
        <RankUser key={rankUser.nickname} rankUser={rankUser} />
      ))}
    </div>
  );
};

const RankUserColumn = () => {
  return (
    <div className={styles.rankUser}>
      <p> 순위 </p>
      <p> 점수 </p>
      <p> 닉네임 </p>
    </div>
  );
};

export default RankUserList;