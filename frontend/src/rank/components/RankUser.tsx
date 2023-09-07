import { RankUserProps } from '../rankType';

const RankUser = ({ rankUser }: RankUserProps) => {
  return (
    <div>
      <h1>Rank User</h1>
      <p>nickname: {rankUser.nickname}</p>
      <p>rankScore: {rankUser.rankScore}</p>
      <p>rank: {rankUser.rank}</p>
    </div>
  );
};

export default RankUser;