import styles from '@/profile/styles/Profile.module.css';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ProfileProps, ProfileData } from '@/type/profileType';
import RecentGame from './RecentGame';
import { SocketContext } from '@/context/socket';

const Profile = ({ nickname }: ProfileProps) => {
  const socket = useContext(SocketContext);
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile/${nickname}`).then((res) => {
      setUser(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  socket.on('game-loading', () => {
    setLoading(true);
  });
  
  return (
    loading ?
      '상대의 게임접속을 기다리는 중...' :
      <div className={styles.profile}>
        <Image src={user?.avatar ?? '/pongNyan.png'} alt={user?.nickname ?? 'Pong nyan'} width={100} height={100} />
        <h2>{user?.nickname ?? 'who R U'}</h2>
        <h3>래더 스코어</h3>
        <p>{user?.rankScore ?? 'zero'}</p>
        <RecentGame game={user?.winnerGames ?? []} />
        <br />
        <RecentGame game={user?.loserGames ?? []} />
      </div>
  );
};

export default Profile;