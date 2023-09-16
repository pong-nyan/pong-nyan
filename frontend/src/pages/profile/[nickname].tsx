import Profile from '@/profile/components/Profile';
import Matching from '@/profile/components/Matching';
import RequestFriendInProfile from '@/profile/components/RequestFriendInProfile';
import DirectMessageInProfile from '@/profile/components/DirectMessageInProfile';
import { useRouter } from 'next/router';
import NavButtonWrapper from '@/_components/NavButtonWrapper';
import useAuth from '@/context/useAuth';
import Link from 'next/link';
import styles from '@/profile/styles/Profile.module.css';
import RequestBlockInProfile from '@/profile/components/RequesetBlock';

const ProfilePage = () => {
  useAuth();
  const router = useRouter();
  const { nickname } = router.query;
  if (!nickname) return 'no user';

  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      const { nickname: userNickname } = JSON.parse(user);
      if (userNickname === nickname) {
        return (
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <h1 className={styles.title}>Profile Page</h1>
              <Link className={styles.link} href={'/profile/update'}>
                Update Profile
              </Link>
              <Link className={styles.link} href={'/friend/manage'}>
                Manage Friend
              </Link>
              <Link className={styles.link} href={'/profile/block'}>
                Manage BlockList
              </Link>
            </div>
            <Profile nickname={nickname as string} />
            <NavButtonWrapper />
          </div>
        );
      }
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Profile Page</h1>
        <Matching nickname={nickname as string} />
        <RequestFriendInProfile nickname={nickname as string} />
        <RequestBlockInProfile nickname={nickname as string} />
      </div>
      <Profile nickname={nickname as string} />
      <RequestFriendInProfile nickname={nickname as string} />
      <DirectMessageInProfile nickname={nickname as string} />
      <NavButtonWrapper />
    </div>
  );
};

export default ProfilePage;
