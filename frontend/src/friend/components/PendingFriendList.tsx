import { useEffect, useState } from 'react';
import PendingFreind from '@/friend/components/PendingFriend';
import { PendingFriend } from '@/type/friendType';

const PendingFriendList = () => {
  const [pendingFriends, setPendingFriends] = useState<PendingFriend[]>([]);

  useEffect(() => {
    setPendingFriends([
      {
        nickname: 'seongyle',
        createdAt: '2023-01-12',
      },
      {
        nickname: 'jimin',
        createdAt: '2022-02-11'
      }
    ]);
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