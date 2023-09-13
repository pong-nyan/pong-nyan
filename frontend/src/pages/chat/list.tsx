import MakeChannelButton from '@/chat/components/MakeChannelButton';
import MakeChannel from '@/chat/components/MakeChannel';
import ChannelList from '@/chat/components/ChannelList';
import { useState } from 'react';
import NavButtonWrapper from '@/_components/NavButtonWrapper';
import useAuth from '@/context/useAuth';

const ChannelListPage = () => {
  useAuth();
  const [isMakeChannelOpen, setMakeChannelOpen] = useState(false);

  const handleOpenMakeChannel = () => {
    setMakeChannelOpen(true);
  };

  const handleCloseMakeChannel = () => {
    setMakeChannelOpen(false);
  };

  return (
    <div className="commonLayout" >
      <div style={{ flex: 1, border: '2px solid gray', overflowY: 'auto', height: '100%' }}>
        <ChannelList />
        <MakeChannel isOpen={isMakeChannelOpen} onClose={handleCloseMakeChannel} />
        <MakeChannelButton onMakeChannel={handleOpenMakeChannel} />
        <NavButtonWrapper />
      </div>
    </div>
  );
};

export default ChannelListPage;