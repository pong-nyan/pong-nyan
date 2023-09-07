import RankUserList from '@/rank/components/RankUserList';
import { useState, useEffect } from 'react';
import { RankUserType } from '@/rank/rankType';

const RankPage = () => {
  const [rankUsers, setRankUsers] = useState<RankUserType[]>([]);

  // dummy data

  useEffect(() => {
    setRankUsers([
      {
        nickname: 'test1',
        rankScore: 100,
        rank: 1
      },
      {
        nickname: 'test2',
        rankScore: 200,
        rank: 2
      },
      {
        nickname: 'test3',
        rankScore: 300,
        rank: 3
      },
    ]);
  }, []);

  return (
    <div>
      <h1>Rank Page</h1>
      <RankUserList rankUserList={rankUsers} />
    </div>
  );
};

export default RankPage;