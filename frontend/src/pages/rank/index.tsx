import RankUserList from '@/rank/components/RankUserList';
import { useState, useEffect } from 'react';
import { RankUserType } from '@/rank/rankType';
import axios from 'axios';

const RankPage = () => {
  const [rankUsers, setRankUsers] = useState<RankUserType[]>([]);

  // dummy data
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rank`, { withCredentials: true })
      .then(response => {
        console.log(response.data.rankUsers);
        setRankUsers(response.data.rankUsers);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Rank Page</h1>
      <RankUserList rankUserList={rankUsers} />
    </div>
  );
};

export default RankPage;