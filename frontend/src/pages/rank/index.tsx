import RankUserList from '@/rank/components/RankUserList';
import { useState, useEffect } from 'react';
import { RankUserType } from '@/type/rankType';
import axios from 'axios';
import Pagination from '@/rank/components/Pagination';

const RankPage = () => {
  const [rankUsers, setRankUsers] = useState<RankUserType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const handleCurrentPage = (page: number) => {
    if (page < 1) {
      alert('첫 페이지 입니다.');
      setCurrentPage(1);
    } else if (page > lastPage) {
      setCurrentPage(lastPage);
      alert('마지막 페이지 입니다.');
    } else {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rank?page=${currentPage}`, { withCredentials: true })
      .then(response => {
        setRankUsers(response.data.rankUsers);
        setLastPage(response.data.meta.lastPage);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentPage]);

  return (
    <div>
      <h1>Rank Page</h1>
      <RankUserList rankUserList={rankUsers} />
      <Pagination currentPage={currentPage} handleCurrentPage={handleCurrentPage} />
    </div>
  );
};

export default RankPage;