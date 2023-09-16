import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '@/context/socket';
import { Channel } from '@/type/chatType';
import useAuth from '@/context/useAuth';
import PublicChannelList from './PublicChannelList';
import PrivateChannelList from './PrivateChannelLIst';

// onChannelSelect: (channel: Channel) => void  // list.tsx에 선택될 채널을 넘겨줘야함
const ChannelList = () => {
  useAuth();
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const { chatNamespace } = useContext(SocketContext);

  useEffect(() => {
    chatNamespace.emit('chat-request-channel-list');

    chatNamespace.on('chat-update-channel-list', (updatedList) => {
      setChannelList(updatedList);
    });

    chatNamespace.on('chat-join-error', (errorMessage) => {
      alert(errorMessage);
    });

    return () => {
      chatNamespace.off('chat-join-error');
      chatNamespace.off('chat-update-channel-list');
    };
  }, [chatNamespace]);

  return (
    <div className="chat-room-list" style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid gray' }}>
      <h2>Channel list</h2>
      <PublicChannelList channelList={channelList}/>
      <PrivateChannelList channelList={channelList}/>
    </div>
  );
};

export default ChannelList;
