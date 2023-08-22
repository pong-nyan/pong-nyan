import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const MyPage = () => {
  // const router = useRouter();
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/mypage`, { withCredentials: true })
      .then((res) => {
        // if (res.status === 200) {
        console.log(res.status);
        console.log('인증이 완료되었습니다.');
        // TODO : check replace or push
        // router.replace('/auth/mypage');
        // }
      })
      .catch(error => {
        if (error.response.status === 401) {
          console.log('인증되지 않았습니다!');
        } else if (error.response.status === 403) {
          console.log('접근이 거부되었습니다!');
        } else {
          console.log('다른 오류가 발생했습니다:', error.response.status);
        }
      });
  }, []);

  return (
    <div>
      <h1>MyPage</h1>
    </div>
  );
};

export default MyPage;