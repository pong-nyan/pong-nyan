import MakeChannelButton from '@/components/button/MakeChannelButton';
import ChannelList from '@/components/chat/ChannelList';
import ChatRoom from '@/components/chat/ChatRoom';
import { useState } from 'react';
import { Channel } from '@/type';

const ChannelListPage = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const handleLeaveChannel = () => {
    setSelectedChannel(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid gray', overflowY: 'auto' }}>
        <ChannelList onChannelSelect={setSelectedChannel} />
        <MakeChannelButton />
      </div>
      {selectedChannel && (
        <div style={{ flex: 2, overflowY: 'auto' }}>
          <ChatRoom channelId={selectedChannel.id} selectedChannel={selectedChannel} onLeaveChannel={handleLeaveChannel}/>
        </div>
      )}
    </div>
  );
};

export default ChannelListPage;