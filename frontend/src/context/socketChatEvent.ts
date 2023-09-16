import { chatNamespace } from '@/context/socket';
import Router from 'next/router';
import { Nickname } from '@/type/userType';
import { Channel } from '@/type/chatType';

export const socketEmitChatCreateDmEvent = (nickname: Nickname) => {
  chatNamespace.emit('chat-create-dm', { nickname });
};

export const socketOnChatJoinDmEvent = () => { 
  chatNamespace.on('chat-create-dm', ( {channel}: { channel: Channel }) => {
    // setChannelList()

    Router.push(`/chat/${channel.id}`);
  });
};
