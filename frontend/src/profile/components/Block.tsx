import { useEffect } from 'react';
import axios from 'axios';
const Block = () => {

  // TODO: Block API 연동
  // useEffect(() => {
  //   axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/block`)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       if (err?.response?.status === 401) {
  //         alert('로그인이 필요합니다.');
  //         localStorage.removeItem('user');
  //         location.replace('/auth');
  //         return ;
  //       }
  //       console.error(err);
  //     });
  // }, []);
  return (
    <div>
        Block
    </div>
  );
};

export default Block;