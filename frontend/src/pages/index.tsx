import FeatureLinkList from '@/_components/FeatureLinkList';
import Image from 'next/image';
import useAuth from '@/context/useAuth';

export default function Home() {
  useAuth();

  return (
    <>
      <FeatureLinkList />
      <Image src='/assets/start-page.png' alt='start backgrond' fill style={{ objectFit: 'contain', zIndex: -1 }} />
    </>
  );
}
