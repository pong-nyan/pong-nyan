import React, { useState } from 'react';

const MessageChannelListPage = () => {
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
        {showJoinedChannels && (
          <div>
            {/* TODO: 유저가 참여한 방 목록 보여주기 */}
            <p>실제 목록</p>
          </div>
        )}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => setShowDMs(!showDMs)}>
          <h3 style={{ margin: '0' }}>DM 목록</h3>
          <button style={{ marginLeft: '10px' }}>참여방보기</button>
        </div>
        {showDMs && (
          <div>
            {/* TODO: 유저의 DM 목록 보여주기 */}
            <p>실제 목록</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageChannelListPage;