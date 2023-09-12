import styles from '@/friends/styles/Friends.module.css';
import { useState } from 'react';
import Friend from './Friend';
import { FriendProps } from '@/type/friendType';
import { socketEmitFriendOnlineListEvent, socketOnFriendOnlineListEvent } from '@/friends/hooks/socketFriendEvent';
import { UserInfo } from '@/type/userType';
import { useGetFriendsData } from '../hooks/useGetFriendsData';

// TODO: type 분리 해야함!!!!!

const Friends = () => {
  const [friends, setFriends] = useState<FriendProps[]>();
  const [friendOnlineList, setFriendOnlineList] = useState<UserInfo[]>();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const intraId = user.intraId;
  //친구 정보를 불러온다.
  // ---- //
  
  useGetFriendsData(setFriends, intraId);
  socketEmitFriendOnlineListEvent(friends);
  socketOnFriendOnlineListEvent(setFriendOnlineList);

  if (!friends || !friends.length) return (
    <div>
      <h1 className={styles.profile}>Friends List</h1>
      <div className={styles.profile}>you don't have friends</div>
    </div>
  );
  
  //make friend component
  // ---- //

  //친구를 출력한다. 
  // ---- //
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