import styles from '@/friends/styles/Friend.module.css';
import Image from 'next/image';
import Link from 'next/link';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { socket } from '@/context/socket';

// TODO: type 분리 해야함!!!!!
type FriendProps = {
  intraId: number;
};

enum FriendStatus {
  OFFLINE = 0,
  ONLINE = 1,
  INGAME = 2,
}

type FriendData = {
  intraId: number;
  nickname: string;
  status: FriendStatus;
  avatar: string;
  rankScore: number;
}

const Friend = ({ intraId } : FriendProps) => {
  // const [ friend, setFriend ] = useState<FriendData | null>(null);
  // //TODO: 친구가 게임하고 있으면 그 상태를 받아와야함.

  // if (!friend) {
  //   return null;
  // }

  // axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friend?intraId=${intraId}`).then((res) => {
  //   setFriend(res.data);
  // }).catch((err) => {
  //   void err;
  //   return <div>친구 정보를 불러오는데 실패했습니다.</div>;
  // });

  // socket.on('friendStatus-'+ intraId, (data: FriendStatus) => {
  //   setFriend({...friend, status: data});
  // });

  // let styleColor ;
  // switch (friend.status) {
  // case FriendStatus.OFFLINE:
  //   styleColor = {color : 'gray'};
  //   break;
  // case FriendStatus.ONLINE:
  //   styleColor ={color : 'green'};
  //   break;
  // case FriendStatus.INGAME:
  //   styleColor ={color : 'yellow'};
  //   break;
  // }

  //TODO: remove data and change realdate
  const friend = {
    avatar: '/pong-nyan.png',
    nickname: 'juha',
    rankScore: 1000,
    status: FriendStatus.ONLINE,
  };
  const redirection = 'profile/' + friend.nickname;
  const styleColor = {color : 'gray'};
  
  return (
    <div className={styles.friend}>
      <p>
        <span className={styles.nickname} style={styleColor}> 
          <Link href={redirection}>
            {friend.nickname} 
          </Link>
        </span>
        <Image src={friend.avatar ?? 'pong-nyan.png'} alt='avatar' width={50} height={50} /> 
        <span className={styles.score}> 
          <Link href='rank'> {friend.rankScore}</Link> 
        </span>
      </p>
    </div>
  );
};

export default Friend;