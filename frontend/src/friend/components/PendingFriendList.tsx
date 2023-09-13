import { useEffect, useState } from 'react';
import PendingFreind from '@/friend/components/PendingFriend';
import { PendingFriend } from '@/type/friendType';
import axios from 'axios';

const PendingFriendList = () => {
  const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/me/pending`).then((res) => {
      const requestUser = res.data.map((friend: PendingFriend) => friend.requestUser);
      setPendingFriends(requestUser);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <div>
      {
        pendingFriends.map((friend, index) => (
          <PendingFreind key={index} pendingFriend={friend} />
        ))
      }
    </div>
  );
};

export default PendingFriendList;