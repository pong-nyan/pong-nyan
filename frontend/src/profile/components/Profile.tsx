import styles from '@/profile/styles/Profile.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';

// TODO: type 분리 해야함!!!!!
type ProfileProps = {
  intraId: number;
};

type ProfileData = {
  intraId: number;
  avatar: string;
  nickname: string;
  rankScore: number;
  recentWinner: string;
  recentLoser: string;
}

//TODO: nickname, laderBoardScore, recentPerformance, achievement
const Profile = ({ intraId } : ProfileProps) => {
  const [ user, setUser ] = useState<ProfileData | null>(null);
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile?intraId=${intraId}`).then((res) => {
      setUser(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  // ---- //
  return (
    <div className={styles.profile}>
      <Image src={user?.avatar ?? '/pongNyan.png'} alt={user?.nickname ?? 'Pong nyan'} width={100} height={100} />
      <h2>{user?.nickname ?? 'who R U'}</h2>
      <h3>래더 스코어</h3>
      <p>{user?.rankScore ?? 'zero'}</p>
      <h3>래더 최근 성적</h3>
      <p>winner : {user?.recentWinner ?? 'unknown'} | loser : {user?.recentLoser ?? 'unknown'} </p>
    </div>
  );
};

export default Profile;