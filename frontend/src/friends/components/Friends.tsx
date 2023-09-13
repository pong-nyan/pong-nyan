import styles from '@/friends/styles/Friends.module.css';
import { useState } from 'react';
import Friend from './Friend';
import { FriendProps, FriendStatus } from '@/type/friendType';
import { UserInfo } from '@/type/userType';
import { socketEmitFriendOnlineListEvent, socketOnFriendOnlineListEvent } from '@/friends/hooks/socketFriendEvent';
import { useGetFriendsData } from '../hooks/useGetFriendsData';

const Friends = () => {
  const [friends, setFriends] = useState<FriendProps[]>();
  const [friendOnlineList, setFriendOnlineList] = useState<UserInfo[]>();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const intraId = user.intraId;
  
  useGetFriendsData(setFriends, intraId);
  socketEmitFriendOnlineListEvent(friends);
  socketOnFriendOnlineListEvent(setFriendOnlineList);

// // test data
//   const friends: FriendProps[] = [
//     {
//       intraId: 1,
//       nickname: 'test1',
//       avatar: '/pong-nyan.png',
//       rankScore: 1,
//       status: 0,
//     },
//     {
//       intraId: 2,
//       nickname: 'test2',
//       avatar: '/pong-nyan.png',
//       rankScore: 2,
//       status: 0,
//     },
//     {
//       intraId: 3,
//       nickname: 'test3',
//       avatar: '/pong-nyan.png',
//       rankScore: 3,
//       status: 0,
//     }
//   ];
  
//   const friendOnlineList : UserInfo[] = [
//     {
//       intraId: 1,
//       nickname: 'test1',
//       chatRoomList: [],
//       gameRoom: '',
//       online: true,
//     },
//     {
//       intraId: 2,
//       nickname: 'test2',
//       chatRoomList: [],
//       gameRoom: 'gg',
//       online: true,
//     },
//     {
//       intraId: 3,
//       nickname: 'test3',
//       chatRoomList: [],
//       gameRoom: 'asdf',
//       online: false,
//     }
//   ];


  if (!friends || !friends.length) return (
    <div>
      <h1 className={styles.profile}>Friends List</h1>
      <div className={styles.profile}>you don't have friends</div>
    </div>
  );

  friends.map((friend: FriendProps) => {
    if (friendOnlineList === undefined) return;

    friendOnlineList.map((friendOnline: UserInfo) => {
      if (friendOnline.intraId === friend.intraId) {
        if (!friendOnline.online) {
          friend.status = FriendStatus.OFFLINE;
        } else if (friendOnline.gameRoom !== '') {
          friend.status = FriendStatus.INGAME;
        } else {
          friend.status = FriendStatus.ONLINE;
        }
      }
    });
  });

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