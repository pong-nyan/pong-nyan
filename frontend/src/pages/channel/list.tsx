import MakeChannelButton from '@/chat/components/MakeChannelButton';
import MakeChannel from '../../chat/components/MakeChannel';
import ChannelList from '../../chat/components/ChannelList';
import ChatRoom from '../../chat/components/ChatRoom';
import { useState } from 'react';
import { Channel } from '@/chat/chatType';
import NavButtonWrapper from '../../chat/components/NavButtonWrapper';
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