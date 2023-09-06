import styles from '@/styles/Profile.module.css';
import Image from 'next/image';

//TODO: nickname, laderBoardScore, recentPerformance, achievement
const Profile = (userId: string) => {
  if (userId === 'userId') {
    return (
      <h1> 존재하지 않는 사용자입니다. </h1>
    );
  }

  //여기서 유저 정보를 받아와서 띄워줘야 함
  const profileImage = '/pongNyan.png';
  const nickname = 'nickname';
  const laderBoardScore = 0;
  const recentPerformance = 'empty';
  const achievement = 'empty';

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

export default Profile;