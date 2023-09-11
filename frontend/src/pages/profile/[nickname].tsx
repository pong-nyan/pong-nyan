import Profile from '@/profile/components/Profile';
import { useRouter } from 'next/router';
import NavButtonWrapper from '@/chat/components/NavButtonWrapper';

const ProfilePage = () => {
  const router = useRouter();
  const { nickname } = router.query;
  if (!nickname) return 'no user';
  return (
    <div>
      <h1>Profile Page</h1>
      <Profile nickname={nickname as string} />
      <NavButtonWrapper />
    </div>
  );

};

export default ProfilePage;