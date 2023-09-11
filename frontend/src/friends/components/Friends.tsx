import styles from '@/friends/styles/Friends.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Friend from './Friend';

// TODO: type 분리 해야함!!!!!
type FriendsProps = {
  intraId: number;
};

type FriendsData = {
  intraId: number;
  nickname: string;
  status: number;
  avatar: string;
  rankScore: number;
}

function checkFriends(element: FriendsData, intraId: number): boolean {
  return (element.intraId === intraId);
}

const Friends = ({ intraId } : FriendsProps) => {
  const [ friends, setFriends ] = useState<FriendsData[] | null>(null);
  
  useEffect(() => {
    if (friends?.length && friends?.some(checkFriends)) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends?intraId=${intraId}`).then((res) => {
        setFriends([friends, res.data]);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [ intraId ]);

  // if (friends === null) {
  //   return (
  //     <div className={styles.friends}>
  //       <h1>너 친구도 없냐? ㅋㅋㅋ</h1>
  //     </div>
  //   );
  // }

  //친구를 출력한다. 
  // ---- //
  return (
    <>
      <h1 className={styles.profile}>Friends List</h1>
      <Friend intraId={0}/>
      {/* <ol>
        {friends.map((friend) => (
          <li key={friend.intraId}>
            <div className={styles.friend}>
              <img src={friend.avatar} alt="avatar" />
              <div className={styles.friendInfo}>
                <h2>{friend.nickname}</h2>
                <p>{friend.rankScore}</p>
              </div>
            </div>
          </li>
        ))}
      </ol> */}
    </>
  );
};

export default Friends;