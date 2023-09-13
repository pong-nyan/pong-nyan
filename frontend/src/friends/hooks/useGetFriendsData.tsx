import { Dispatch, SetStateAction, useEffect } from 'react';
import axios from 'axios';
import { FriendProps } from '@/type/friendType';

export const useGetFriendsData = (setFriends: Dispatch<SetStateAction<FriendProps[] | undefined>>, intraId: string) => {
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends?intraId=${intraId}`).then((res) => {
      setFriends(res.data);
    }).catch((err) => {
      void err;
      return <div>친구 정보를 불러오는데 실패했습니다.</div>;
    });
  }, []);
};