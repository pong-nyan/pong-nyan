import Profile from '@/profile/components/Profile';
import { useRouter } from 'next/router';

const ProfilePage = () => {
  const router = useRouter();
  const { nickname } = router.query;
  if (!nickname) return 'no user';
  return (
    <div>
      <h1>Profile Page</h1>
      <Profile nickname={nickname as string} />
    </div>
  );

};

export default ProfilePage;