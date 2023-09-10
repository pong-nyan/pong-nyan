import FeatureLinkList from '@/_components/FeatureLinkList';
import useAuth from '@/context/useAuth';

export default function Home() {
  useAuth();

  return (
    <>
      <FeatureLinkList /> 
    </>
  );
}
