import styles from '@/friends/styles/Friends.module.css';
import { useState } from 'react';
import Friend from './Friend';
import { FriendProps } from '@/type/friendType';
import { useGetFriendsData } from '../hooks/useGetFriendsData';
import useAuth from '@/context/useAuth';

const Friends = () => {
  useAuth();
  const [friends, setFriends] = useState<FriendProps[]>();
  useGetFriendsData(setFriends);
  //중복데이터 제거
  const uniqueFriends = friends?.filter((friend, index, self) =>
    index === self.findIndex((t) => (
      t.intraId === friend.intraId
    ))
  );
  
  if (!uniqueFriends || !friends || !friends.length) return (
    <div>
      <h1 className={styles.profile}>Friends List</h1>
      <div className={styles.profile}>you don't have friends</div>
    </div>
  );
  
  return (
    <>
      <h1 className={styles.profile}>Friends List</h1>
      <div className={styles.profile}>
        {uniqueFriends.map((friend: FriendProps) => (
          <Friend key={friend.intraId} {...friend} />
        ))}
      </div>
    </>
  );
};

export default Friends;