import { Dispatch, SetStateAction, useEffect } from 'react';
import axios from 'axios';
import { FriendProps } from '@/type/friendType';

export const useGetFriendsData = (setFriends: Dispatch<SetStateAction<FriendProps[] | undefined>>) => {
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/me/accepted`).then((res) => {
      setFriends(res.data);
    }).catch((err) => {
      if (err?.response?.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('user');
        location.replace('/auth');
        return ;
      }
      console.error(err);
      return <div>친구 정보를 불러오는데 실패했습니다.</div>;
    });
  }, []);
};