import styles from '@/friends/styles/Friends.module.css';
import { useState } from 'react';
import Friend from './Friend';
import { FriendProps, FriendStatus } from '@/type/friendType';
import { UserInfo } from '@/type/userType';
import { useGetFriendsData } from '../hooks/useGetFriendsData';

const Friends = () => {
  const [friends, setFriends] = useState<FriendProps[]>();
  useGetFriendsData(setFriends);


  if (!friends || !friends.length) return (
    <div>
      <h1 className={styles.profile}>Friends List</h1>
      <div className={styles.profile}>you don't have friends</div>
    </div>
  );
  return (
    <>
      <h1 className={styles.profile}>Friends List</h1>
      <div className={styles.profile}>
        {friends.map((friend: FriendProps) => (
          <Friend key={friend.intraId} {...friend} />
        ))}
      </div>
    </>
  );
};

export default Friends;