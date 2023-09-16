import { Channel } from '@/type/chatType';
import { useRouter } from 'next/router';
import { useContext, useRef } from 'react';
import { SocketContext } from '@/context/socket';

const PrivateChannelList = ({channelList }: {channelList: Channel[]}) => {
  const router = useRouter();
  const { chatNamespace } = useContext(SocketContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loggedInUserRef = useRef<any>();

  if (typeof window !== 'undefined') {
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    loggedInUserRef.current = loggedInUser.intraId;
  }

  const handlePrivateChannelSelect = (channel: Channel) => {
    const seletedChannel = channelList.find(ch => ch.id === channel.id);
    if (!seletedChannel) return;
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isUserInChannel = seletedChannel.userList.some((user) => user.intraId === loggedInUser.intraId);

    if (!isUserInChannel) {
      alert('없는채널 입니다.');
      return ;
    }
    chatNamespace.emit('chat-join-channel', { channelId: seletedChannel.id });
    router.push(`/chat/${seletedChannel.id}`);
  };

  return (
    <div>
      <h3>Private Channel</h3>
      <ul>
        {
          channelList.map((channel) => (
            <li key={channel.id} style={{ cursor: 'pointer' }}>
              <span onClick={() => handlePrivateChannelSelect(channel)}>{channel.title}</span>
            </li>
          ))
        }
      </ul>
    </div> );
};

export default PrivateChannelList;