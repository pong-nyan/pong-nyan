import styles from '@/profile/styles/Profile.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ProfileProps, ProfileData } from '@/type/profileType';
import RecentGame from './RecentGame';

const Profile = ({ nickname }: ProfileProps) => {
  const [user, setUser] = useState<ProfileData | null>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/${nickname}`).then((res) => {
      setUser(res.data);
    }).catch((err) => {
      if (err?.response?.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('user');
        location.replace('/auth');
        return ;
      }
      console.error(err);
    });
  }, [nickname]);

  return (
    <div className={styles.profile}>
      <span className={styles.font}>
        <Image src={user?.avatar ?? '/pongNyan.png'} alt={user?.nickname ?? 'Pong nyan'} width={100} height={100} />
        <h2>{user?.nickname ?? 'no data'}</h2>
        <h3>래더 스코어 : {user?.rankScore ?? 'no data'}</h3>
        <RecentGame game={user?.winnerGames ?? []} label='winning game' />
        <br />
        <RecentGame game={user?.loserGames ?? []} label='losing game' />
      </span>
    </div>
  );
};

export default Profile;