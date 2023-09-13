import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '@/context/socket';
import { Channel } from '@/type/chatType';
import { useRouter } from 'next/router';

// onChannelSelect: (channel: Channel) => void  // list.tsx에 선택될 채널을 넘겨줘야함
const ChannelList = () => {
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const socket = useContext(SocketContext);
  const router = useRouter();

  const handleChannelSelect = (channel: Channel) => {
    console.log('[Chat] handleChannelSelect', channel);
    const seletedChannel = channelList.find(ch => ch.id === channel.id);
    console.log('[Chat] seletedChannel', seletedChannel);
    console.log('[Chat] seletedChannel userList length', seletedChannel?.userList.length);
    if (!seletedChannel) return;
    let inputPassword;
    if (seletedChannel.password) {
      inputPassword = prompt('이 채널은 비밀번호로 보호되어 있습니다. 비밀번호를 입력하세요.');
      if (!inputPassword) return ;
      if (inputPassword !== seletedChannel.password) {
        alert('비밀번호가 틀렸습니다.');
        return ;
      }
    }
    if (seletedChannel.maxUsers <= seletedChannel.userList.length) {
      alert('채널이 가득 찼습니다.');
      return ;
    }

    socket.emit('chat-join-channel', { channelId: seletedChannel.id, password: inputPassword });

    router.push(`/chat/${seletedChannel.id}`);
  };

  useEffect(() => {
    socket.emit('chat-request-channel-list');

    socket.on('chat-update-channel-list', (updatedList) => {
      console.log('[Chat] on chat-update-channel-list');
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
            <span onClick={() => handleChannelSelect(channel)}>{channel.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;