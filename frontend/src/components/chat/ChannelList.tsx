import React, { useState, useEffect } from 'react';
import { socket } from '@/context/socket';
import { Channel } from '@/type';

const ChannelList = () => {
  const [channelList, setChannelList] = useState<Channel[]>([]);

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
    <div className="chat-room-list">
      <h2>Channel list</h2>
      <ul>
        {channelList.map(channel => (
          console.log('ChannelList.tsx channel', channel),
          <li key={channel.id}> {channel.title}</li>
        ))}
      </ul>
    </div>
  );
};
export default ChannelList;