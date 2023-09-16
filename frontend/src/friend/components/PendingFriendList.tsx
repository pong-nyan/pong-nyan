import { useEffect, useState } from 'react';
import PendingFreind from '@/friend/components/PendingFriend';
import { PendingFriend } from '@/type/friendType';
import axios from 'axios';

const PendingFriendList = () => {
  const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]);
  const [friendIdList, setFriendIdList] = useState<number[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/me/pending`).then((res) => {
      const tempFriendIdIlist = res.data.map((friend: PendingFriend) => friend.id);
      const requestUser = res.data.map((friend: PendingFriend) => {
        return friend.requestUser;
      });
      setFriendIdList(tempFriendIdIlist);
      setPendingFriends(requestUser);
    }).catch((err) => {
      if (err.response.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('user');
        location.replace('/auth');
      }
      console.log(err);
    });
  }, []);
  return (
    <div>
      {
        pendingFriends.map((friend, index) => (
          <PendingFreind key={index} pendingFriend={friend} friendId={friendIdList[index]} />
        ))
      }
    </div>
  );
};

export default PendingFriendList;