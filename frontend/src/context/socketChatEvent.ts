import { chatNamespace } from '@/context/socket';
import Router from 'next/router';
import { Nickname } from '@/type/userType';
import { Channel, Message, ChannelId } from '@/type/chatType';
import { addMessageToLocalStorage } from '@/chat/utils/chatLocalStorage';
import axios from 'axios';

export const socketEmitChatCreateDmEvent = (nickname: Nickname) => {
  chatNamespace.emit('chat-create-dm', { nickname });
};

export const socketOnChatJoinDmEvent = () => {
  chatNamespace.on('chat-join-dm', ({ channel }: { channel: Channel }) => {
    Router.push(`/chat/${channel.id}`);
  });
};

// 메시지를 받아서 로컬 스토리지에 저장
export const socketOnChatNewMessage = () => { 
  chatNamespace.on('chat-new-message', async ({ message, channelId }: { message: Message, channelId: ChannelId }) => {
    // 메시지를 받은 채널 ID
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`);
      const userBlockList = res.data.userBlockList;
      if (userBlockList && userBlockList.includes(message.nickname)) return;
      addMessageToLocalStorage(channelId, message);
      chatNamespace.emit('chat-watch-new-message', { channelId });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('user');
        location.replace('/auth');
        return ;
      }
    }
  });
};

export const socketOnChatAddTab = () => { 
  chatNamespace.on('add-tab', () => {
    location.replace('/');
    alert('새로운 탭이 열렸습니다. 하나의 탭만 남겨주세요.');
  });
};

