import { useEffect, useState } from 'react';
import PendingFreind from '@/friend/components/PendingFriend';
import { PendingFriend } from '@/type/friendType';
import axios from 'axios';

const PendingFriendList = () => {
  const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/me/pending`).then((res) => {
      setPendingFriends(res.data);
      // TODO: check res.data
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