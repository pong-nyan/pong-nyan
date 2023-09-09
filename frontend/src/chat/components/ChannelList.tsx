import React, { useState, useEffect } from 'react';
import { socket } from '@/context/socket';
import { Channel } from '@/type/chatType';

const ChannelList = ({ onChannelSelect }) => {
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const handleChannelSelect = (channel: Channel) => {
    const currentChannel = channelList.find(ch => ch.id === channel.id);
    if (!currentChannel) return;

    let password;
    if (currentChannel.password) {
      password = prompt('이 채널은 비밀번호로 보호되어 있습니다. 비밀번호를 입력하세요.');
    }
    socket.emit('chat-join-channel', { channelId: currentChannel.id, password });

    socket.once('chat-join-success', () => {
      onChannelSelect(currentChannel);
      console.log('handleChannelSelect 채널제목눌림 222', currentChannel);
    });
  };

  useEffect(() => {
    socket.emit('chat-request-channel-list');

    socket.on('chat-update-channel-list', (updatedList) => {
      console.log('chat-update-ch-list', updatedList);
      setChannelList(updatedList);
    });

    socket.on('chat-join-error', (errorMessage) => {
      alert(errorMessage);  // 간단하게 alert를 사용하여 사용자에게 알림을 제공
    });

    return () => {
      socket.off('chat-join-error');
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