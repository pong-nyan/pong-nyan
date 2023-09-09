import styles from '@/friends/styles/friends.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

enum userOn {
  online,
  offline
}

// TODO: type 분리 해야함!!!!!
type FriendsProps = {
  intraId: number;
};

type FriendsData = {
  intraId: number;
  nickname: string;
  userOn: userOn;
}

const Friends = ({ intraId } : FriendsProps) => {
  const [ friends, setFriends ] = useState<FriendsData[] | null>(null);
  
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends?intraId=${ intraId }`).then((res) => {
      setFriends([friends, res.data]);
    }).catch((err) => {
      console.log(err);
    });
  }, [ intraId ]);

  console.log(friends);
  //친구 목록을 생성한다.

  // ---- //
  return (
    <div className={styles.friends}>
      {friends?.map((friends) => (
        <li key={friends.nickname}>
          <Link href={`/profile/?intraId=${ intraId }`}>
            <a>{friends.nickname}</a>
          </Link>
        </li>
      ))}      
    </div>
  );
};

export default Friends;