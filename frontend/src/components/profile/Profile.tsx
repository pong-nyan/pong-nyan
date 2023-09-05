import styles from '@/styles/Profile.module.css';
import Image from 'next/image';
import { ProfileProps } from '@/type';

const Profile = ({ nickname, profileImage, laderBoardScore, recentPerformance, achievement }: ProfileProps) => {
  return (
    <div className={styles.profile}>
      <Image src={profileImage} alt={nickname} width={100} height={100} />
      <h2>{nickname}</h2>
      <h3>래더 스코어</h3>
      <p>{laderBoardScore}</p>
      <h3>래더 최근 성적</h3>
      <p>{recentPerformance}</p>
      <h3>업적</h3>
      <p>{achievement}</p>
    </div>
  );
};

Profile.defaultProps = {
  profileImage: '/pongNyan.png',
  nickname: 'nickname',
  laderBoardScore: 0,
  recentPerformance: 'empty',
  achievement: 'empty',
};

export default Profile;