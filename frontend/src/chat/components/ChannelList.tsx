import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '@/context/socket';
import { Channel } from '@/type/chatType';
import { useRouter } from 'next/router';
import { sha256 } from 'js-sha256';

// onChannelSelect: (channel: Channel) => void  // list.tsx에 선택될 채널을 넘겨줘야함
const ChannelList = () => {
  const [channelList, setChannelList] = useState<Channel[]>([]);
  const { chatNamespace } = useContext(SocketContext);
  const router = useRouter();

  const handleChannelSelect = (channel: Channel) => {
    console.log('[Chat] handleChannelSelect', channel);
    const seletedChannel = channelList.find(ch => ch.id === channel.id);
    if (!seletedChannel) return;
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isUserInChannel = seletedChannel.userList.includes(loggedInUser.intraId);
    let hasedInputPassword;

    if (!isUserInChannel) {
      if (seletedChannel.password) {
        const inputPassword = prompt('이 채널은 비밀번호로 보호되어 있습니다. 비밀번호를 입력하세요.');
        if (!inputPassword) return;
        hasedInputPassword = sha256(inputPassword);
        if (hasedInputPassword !== seletedChannel.password) {
          alert('비밀번호가 틀렸습니다.');
          return ;
        }
      }
      if (seletedChannel.maxUsers <= seletedChannel.userList.length) {
        alert('채널이 가득 찼습니다.');
        return ;
      }
    }
    chatNamespace.emit('chat-join-channel', { channelId: seletedChannel.id, password: hasedInputPassword });
    router.push(`/chat/${seletedChannel.id}`);
  };

  useEffect(() => {
    chatNamespace.emit('chat-request-channel-list');

    chatNamespace.on('chat-update-channel-list', (updatedList) => {
      console.log('[Chat] on chat-update-channel-list');
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
