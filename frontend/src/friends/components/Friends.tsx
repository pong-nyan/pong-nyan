import styles from '@/friends/styles/Friends.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Friend from './Friend';
import { FriendProps } from '@/type/friendType';

// TODO: type 분리 해야함!!!!!

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const intraId = user.intraId;
  //친구 정보를 불러온다.
  // ---- //
  
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends?intraId=${intraId}`).then((res) => {
      setFriends(res.data);
    }).catch((err) => {
      void err;
      return <div>친구 정보를 불러오는데 실패했습니다.</div>;
    });
  }, []);
  
  if (!friends.length) return (
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