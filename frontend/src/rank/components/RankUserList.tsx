import RankUser from './RankUser';
import { RankUserListProps } from '@/type/rankType';
import styles from '@/rank/styles/Rank.module.css';

const RankUserList = ({ rankUserList } : RankUserListProps) => {
  return (
    <div className={styles.rankUserList}>
      <RankUserColumn />
      {rankUserList.map((rankUser, index) => (
        <RankUser key={index} rankUser={rankUser} rank={index + 1} />
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