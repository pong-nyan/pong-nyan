import React, { useContext, useEffect, useState } from 'react';
import { Channel } from '@/type/chatType';
import useAuth from '@/context/useAuth';
import PublicChannelList from './PublicChannelList';
import PrivateChannelList from './PrivateChannelLIst';
import { SocketContext } from '@/context/socket';

// onChannelSelect: (channel: Channel) => void  // list.tsx에 선택될 채널을 넘겨줘야함
const ChannelList = () => {
  useAuth();
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const [myPrivateChannelList, setMyPrivateChannelList] = useState<Channel[]>([]);
  const { chatNamespace } = useContext(SocketContext);
  useEffect(() => {
    chatNamespace.emit('chat-request-channel-list');

    chatNamespace.on('chat-update-channel-list', (updatedList) => {
      setChannelList(updatedList);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const privateChannels = updatedList.filter((channel: any) => channel.channelType === 'private');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const myPrivateChannels = privateChannels.filter((channel: any) => {
        const tempUsers = channel.title.split(':');
        const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (tempUsers[0] == loggedInUser.intraId || tempUsers[1] == loggedInUser.intraId) {
          return true;
        }
      });
      setMyPrivateChannelList(myPrivateChannels);
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
      <PublicChannelList channelList={channelList} />
      <hr />
      <PrivateChannelList channelList={myPrivateChannelList} />
    </div>
  );
};

export default ChannelList;
