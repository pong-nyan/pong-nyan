import Profile from '@/profile/components/Profile';
import Matching from '@/profile/components/Matching';
import { useRouter } from 'next/router';
import useAuth from '@/context/useAuth';

const ProfilePage = () => {
  useAuth();
  const router = useRouter();
  const { nickname } = router.query;
  if (!nickname) return 'no user';
  return (
    <div>
      <h1>Profile Page</h1>
      <Profile nickname={nickname as string} />
      <Matching nickname={nickname as string} />
    </div>
  );

};

export default ProfilePage;