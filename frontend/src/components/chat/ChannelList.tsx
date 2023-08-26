import React, { useState } from 'react';

const ChannelList = () => {

  const channelList = [
    // TODO: channel backend API 연동
    { id: 1, name: 'channel 1' },
    { id: 2, name: 'channel 2' },
    { id: 3, name: 'channel 3' },
    // ... 추가 채팅방 정보
  ];
  
  return (
    <div className="chat-room-list">
      <h2>Channel list</h2>
      <ul>
        {channelList.map(channel => (
          <li key={channel.id}> {channel.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;