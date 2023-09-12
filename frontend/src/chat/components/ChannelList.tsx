import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '@/context/socket';
import { Channel } from '@/type/chatType';
import Link from 'next/link';

const ChannelList = ({ onChannelSelect }) => {
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const socket = useContext(SocketContext);

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
    });
  };

  useEffect(() => {
    socket.emit('chat-request-channel-list');

    socket.on('chat-update-channel-list', (updatedList) => {
      setChannelList(updatedList);
    });

    socket.on('chat-join-error', (errorMessage) => {
      alert(errorMessage);
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
          <li key={channel.id} style={{ cursor: 'pointer' }}>
            <Link href={`/chat/${channel.id}`}>
              <span onClick={() => handleChannelSelect(channel)}>{channel.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;