import ParticipatingChannelList from '@/chat/components/ParticipatingChannelList';
import useAuth from '@/context/useAuth';
import React, { useState } from 'react';

const MessageChannelListPage = () => {
  useAuth();
  const [showJoinedChannels, setShowJoinedChannels] = useState(false);
  const [showDMs, setShowDMs] = useState(false);

  return (
    <div>
      <div>
        <h1>이스터 에그 발견 축하합니다.</h1>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => setShowJoinedChannels(!showJoinedChannels)}>
          <h3 style={{ margin: '0' }}>참여방 목록</h3>
          <button style={{ marginLeft: '10px' }}>참여방보기</button>
        </div>
        <>
          {showJoinedChannels && (
            <>
              <ParticipatingChannelList />
            </>
          )}
        </>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => setShowDMs(!showDMs)}>
          <h3 style={{ margin: '0' }}>DM 목록</h3>
          <button style={{ marginLeft: '10px' }}>참여방보기</button>
        </div>
        {showDMs && (
          <>
            <ParticipatingChannelList />
          </>
        )}
      </div>
    </div>
  );
};

export default MessageChannelListPage;