import MakeChannelButton from '@/chat/components/MakeChannelButton';
import MakeChannel from '@/chat/components/MakeChannel';
import ChannelList from '@/chat/components/ChannelList';
import ChatRoom from '@/chat/components/ChatRoom';
import { useState } from 'react';
import { Channel } from '@/type/chatType';
import NavButtonWrapper from '@/chat/components/NavButtonWrapper';
import useAuth from '@/context/useAuth';

const ChannelListPage = () => {
  useAuth();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isMakeChannelOpen, setMakeChannelOpen] = useState(false);

  const handleLeaveChannel = () => {
    setSelectedChannel(null);
  };

  const handleOpenMakeChannel = () => {
    setMakeChannelOpen(true);
  };

  const handleCloseMakeChannel = () => {
    setMakeChannelOpen(false);
  };

  return (
    <div className="commonLayout" >
      <div style={{ flex: 1, border: '2px solid gray', overflowY: 'auto', height: '100%' }}>
        <ChannelList onChannelSelect={setSelectedChannel} />
        <MakeChannel isOpen={isMakeChannelOpen} onClose={handleCloseMakeChannel} />
        <MakeChannelButton onMakeChannel={handleOpenMakeChannel} />
        <NavButtonWrapper />
      </div>
      {selectedChannel && (
        <div style={{ flex: 2, overflowY: 'auto' }}>
          <ChatRoom channelId={selectedChannel.id} selectedChannel={selectedChannel} onLeaveChannel={handleLeaveChannel} />
        </div>
      )}
    </div>
  );
};

export default ChannelListPage;