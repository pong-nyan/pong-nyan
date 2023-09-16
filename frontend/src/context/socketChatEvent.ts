import { chatNamespace } from '@/context/socket';
import Router from 'next/router';
import { Nickname } from '@/type/userType';

export const socketEmitChatCreateDmEvent = (nickname: Nickname) => {
  chatNamespace.emit('chat-create-dm', { nickname });
}


// export const socketOnChatJoinDmEvent = () => { 
//   chatNamespace.on('chat-join-dm', ({ } : ) => {
//     console.log(data);
//     Router.push(`/chat/${data.channelId}`);
//   });
// }
//
