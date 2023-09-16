import { chatNamespace } from '@/context/socket';
import Router from 'next/router';
import { Nickname, UserInfo } from '@/type/userType';
import { Channel, Message, ChannelId } from '@/type/chatType';
import { addMessageToLocalStorage } from '@/chat/utils/chatLocalStorage';
import axios from 'axios';

export const socketEmitChatCreateDmEvent = (nickname: Nickname) => {
  chatNamespace.emit('chat-create-dm', { nickname });
};

export const socketOnChatJoinDmEvent = () => { 
  chatNamespace.on('chat-create-dm', ( {channel}: { channel: Channel }) => {
    // setChannelList()

    Router.push(`/chat/${channel.id}`);
  });
};

// 메시지를 받아서 로컬 스토리지에 저장
export const socketOnChatNewMessage = () => { 
  chatNamespace.on('chat-new-message', async ({ message, receivedChannelId }: { message: Message, receivedChannelId: ChannelId }) => {
    // 메시지를 받은 채널 ID
    const userInfo: UserInfo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`);
    if (userInfo.blockList.includes(message.nickname)) return;

    addMessageToLocalStorage(receivedChannelId, message);
    chatNamespace.emit('chat-watch-new-message', { channelId: receivedChannelId });
  });
};

export const socketOnChatAddTab = () => { 
  chatNamespace.on('add-tab', () => {
    location.replace('/');
    alert('새로운 탭이 열렸습니다. 하나의 탭만 남겨주세요.');
  });
};
