import React, { useState, useEffect } from 'react';
import { socket } from '@/context/socket';
import { Channel } from '@/type';
import ChatRoom from './ChatRoom';

const ChannelList = ({ onChannelSelect }) => {
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    // 백엔드에 채널 입장 이벤트 전송
    socket.emit('chat-join-channel', channel.id);

    // 부모 컴포넌트로 선택된 채널 전달
    onChannelSelect(channel);
  };

  useEffect(() => {
    socket.on('chat-update-channel-list', (updatedList) => {
      console.log('chat-update-ch-list', updatedList);
      setChannelList(updatedList);
    });

    return () => {
      socket.off('chat-update-channel-list');
    };
  }, []);

  return (
    <div className="chat-room-list" style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid gray' }}>
      <h2>Channel list</h2>
      <ul>
        {channelList.map(channel => (
          <li
            key={channel.id}
            onClick={() => handleChannelSelect(channel)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedChannel?.id === channel.id ? 'lightgray' : 'transparent'
            }}
          >
            {channel.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;