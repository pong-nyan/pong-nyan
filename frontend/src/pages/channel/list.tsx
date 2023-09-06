import MakeChannelButton from '@/components/button/MakeChannelButton';
import MakeChannel from '@/components/chat/MakeChannel';
import ChannelList from '@/components/chat/ChannelList';
import ChatRoom from '@/components/chat/ChatRoom';
import { useState } from 'react';
import { Channel } from '@/type';
import NavButtonWrapper from '@/components/button/NavButtonWrapper';
import styles from '@/styles/Common.module.css';

const ChannelListPage = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showMakeChannel, setShowMakeChannel] = useState(false);

  const handleLeaveChannel = () => {
    setSelectedChannel(null);
  };

  const toggleMakeChannel = () => {
    setShowMakeChannel(prevState => !prevState);
  };

  return (
    <div className={styles.commonLayout}>
      <div style={{ flex: 1, borderRight: '1px solid gray', overflowY: 'auto' }}>
        <ChannelList onChannelSelect={setSelectedChannel} />
        {showMakeChannel && <MakeChannel />}
        <MakeChannelButton onMakeChannel={toggleMakeChannel} />
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