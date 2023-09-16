import useAuth from '@/context/useAuth';
import Block from '@/profile/components/Block';

const BlockPage = () => {
  useAuth();

  return (
    <>
      <h1>Block Page</h1>
      <Block />
    </>
  );
};

export default BlockPage;