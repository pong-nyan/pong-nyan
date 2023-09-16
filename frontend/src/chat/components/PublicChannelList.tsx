import { Channel } from '@/type/chatType';
import { useRouter } from 'next/router';
import { sha256 } from 'js-sha256';
import { useContext } from 'react';
import { SocketContext } from '@/context/socket';

const PublicChannelList = ({channelList }: {channelList: Channel[]}) => {
  const router = useRouter();
  const { chatNamespace } = useContext(SocketContext);

  const handlePublicChannelSelect = (channel: Channel) => {
    const seletedChannel = channelList.find(ch => ch.id === channel.id);
    if (!seletedChannel) return;
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isUserInChannel = seletedChannel.userList.some((user) => user.intraId === loggedInUser.intraId);
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
      if (seletedChannel.bannedUsers.includes(loggedInUser.intraId)) {
        alert('차단된 사용자입니다.');
        return ;
      }
    }
    chatNamespace.emit('chat-join-channel', { channelId: seletedChannel.id, password: hasedInputPassword });
    router.push(`/chat/${seletedChannel.id}`);
  };

  return (
    <div>
      <h3>Public Channel</h3>
      <ul>
        {channelList.map(channel => (
          (channel.channelType === 'public' || channel.channelType === 'protected') &&
        <li key={channel.id} style={{ cursor: 'pointer' }}>
          <span onClick={() => handlePublicChannelSelect(channel)}>{channel.title}</span>
        </li>
        ))}
      </ul>
    </div>);
};

export default PublicChannelList;