import RankUser from './RankUser';
import { RankUserListProps } from '../rankType';

const RankUserList = ({ rankUserList } : RankUserListProps) => {
  return (
    <div>
      <h1>Rank User List</h1>
      {rankUserList.map((rankUser) => (
        <RankUser key={rankUser.nickname} rankUser={rankUser} />
      ))}
    </div>
  );
};

export default RankUserList;