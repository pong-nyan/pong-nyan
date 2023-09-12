import ParticipatingChannelList from '@/chat/components/ParticipatingChannelList';
import useAuth from '@/context/useAuth';
import React, { useState } from 'react';

// TODO: 유저가 참여한 방목록을 보여줄 유저의 구별이 구현되어 있지 않음 유저를 받을수 있게 되면 다시 만들어야함
const MessageChannelListPage = () => {
  useAuth();
  const [showJoinedChannels, setShowJoinedChannels] = useState(false);
  const [showDMs, setShowDMs] = useState(false);

  return (
    <div>
      <div>
        <h1>대화방 목록</h1>
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