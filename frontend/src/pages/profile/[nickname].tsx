import Profile from '@/profile/components/Profile';
import Matching from '@/profile/components/Matching';
import RequestFriendInProfile from '@/profile/components/RequestFriendInProfile';
import DirectMessageInProfile from '@/profile/components/DirectMessageInProfile';
import { useRouter } from 'next/router';
import NavButtonWrapper from '@/_components/NavButtonWrapper';
import useAuth from '@/context/useAuth';
import Link from 'next/link';
import styles from '@/profile/styles/Profile.module.css';

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
            <h1 className={styles.title}>Profile Page</h1>
            <Profile nickname={nickname as string} />
            <Link href={'/profile/update'}>
              Update Profile
            </Link>
            <Link href={'/friend/manage'}>
              Manage Friend
            </Link>
            <NavButtonWrapper />
          </div>
        );
      }
    }
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile Page</h1>
      <Matching nickname={nickname as string} />
      <Profile nickname={nickname as string} />
      <RequestFriendInProfile nickname={nickname as string} />
      <DirectMessageInProfile nickname={nickname as string} />
      <NavButtonWrapper />
    </div>
  );
};

export default ProfilePage;
