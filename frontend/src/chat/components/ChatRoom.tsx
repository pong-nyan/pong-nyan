import React, { useState, useEffect, useContext, use } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SendMessageButton from './SendMessageButton';
import { SocketContext } from '@/context/socket';
import { getMessagesFromLocalStorage } from '../utils/chatLocalStorage';
import { Message } from '@/type/chatType';
import { Channel } from '@/type/chatType';
import { IntraId } from '@/type/userType';

function ChatRoom({ channelId, onLeaveChannel } : { channelId: string, onLeaveChannel: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [channel, setChannel] = useState<Channel | null>(null);
  // 선택한 유저 (선택될때마다 다시 렌더링이 필요해서 넣음) TODO : 다시생각해보기
  // const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { chatNamespace } = useContext(SocketContext);

  useEffect(() => {
    console.log('[Chat] 처음 접속시 localStorage에서 메시지 불러옴');
    const loadedMessages = getMessagesFromLocalStorage(channelId as string);
    setMessages(loadedMessages);
  }, [chatNamespace, channelId]);

  useEffect(() => {
    console.log('[Chat] 처음 접속했을때 채널 정보를 서버에 요청함');
    if (channelId) {
      console.log('[Chat] 처음 접속했을때 channelId 존재함');
      chatNamespace.emit('chat-request-channel-info', { channelId });
    }
  }, [chatNamespace, channelId]);

  useEffect(() => {
    console.log('[Chat] 접속해있는 URL의 channelId가 바뀔때마다 채널 정보를 서버에 요청함');
    if (channelId) {
      chatNamespace.on('chat-response-channel-info', (response) => {
        console.log('[Chat] chat-response-channel-info 받음', response);
        if (response.error) {
          alert(response.error);
        } else {
          setChannel(response.channel);
        }
      });

      return () => {
        chatNamespace.off('chat-response-channel-info');
      };
    }
  }, [chatNamespace, channel, channelId]);

  useEffect(() => {
    console.log('[Chat] 채널 정보를 서버에 다시 요청함');
    if (channelId) {
      chatNamespace.emit('chat-request-channel-info', { channelId });
      chatNamespace.on('chat-response-channel-info', (response) => {
        if (response.error) {
          alert(response.error);
        } else {
          setChannel(response.channel);
        }
      });
      return () => {
        chatNamespace.off('chat-response-channel-info');
      };
    }
  }, [chatNamespace, channelId]);

  useEffect(() => {
    chatNamespace.on('chat-watch-new-message', (data)=>{
      console.log('[Chat] chat-watch-new-message', data);
      const { channelId: receivedChannelId } = data;
      const storageMessages = getMessagesFromLocalStorage(receivedChannelId);
      setMessages(storageMessages);
    });

    return () => {
      chatNamespace.off('chat-watch-new-message');
    };
  }, [chatNamespace, channelId]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newMessage : Message = {
        content: inputMessage,
        nickname: loggedInUser.nickname
      };
      chatNamespace.emit('chat-message-in-channel', { channelId, message: newMessage });
      setInputMessage('');
    }
  };

  const handleLeaveChannel = () => {
    chatNamespace.emit('chat-leave-channel', channelId);
    onLeaveChannel();
  };

  const makeAdministrator = (grantedUser: IntraId) => {
    // 서버에 업데이트된 목록을 보내는 로직 추가
    chatNamespace.emit('chat-grant-administrator', { channelId, user: grantedUser });
  };

  // 선택된 사용자가 변경될 때마다 관리자로 임명하는 로직을 실행합니다.

  // useEffect(() => {
  //   console.log('[Chat] selectedUser 변경됨', selectedUser);
  //   if (selectedUser) {
  //     chatNamespace.emit('chat-grant-administrator', { channelId, user: selectedUser });
  //   }
  //   // TODO:
  //   // 만약실패하면 chat-grant-error 보내야함
  //   // emit이후 임명이후 channel의 상태가 바뀌었다고 서버쪽에서 다시 보내줘야함
  //   chatNamespace.on('chat-grant-error', (errorMessage) => {
  //     alert(errorMessage);
  //   });

  //   return () => {
  //     chatNamespace.off('chat-grant-error');
  //   };
  // }, [selectedUser]);

  useEffect(() => {
    chatNamespace.on('chat-grant-administrator-finish', (finishMessage) => {
      setChannel(channel);
      alert(finishMessage);
    });
    chatNamespace.on('chat-grant-error', (errorMessage) => {
      alert(errorMessage);
    });

    return () => {
      chatNamespace.off('chat-grant-administrator-finish');
      chatNamespace.off('chat-grant-error');
    };
  }, [chatNamespace]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', height: '100%', maxWidth: '700px', minWidth: '370px', backgroundColor: 'ivory' }}>
        <div style={{ padding: '10px', borderBottom: '1px solid gray' }}>
          <strong>Current Channel:</strong> {channel?.title ? channel.title : 'No Channel Selected'}
          <button onClick={handleLeaveChannel}>Leave Channel</button>
        </div>
        <div style={{ padding: '10px', borderBottom: '1px solid gray' }}>
          <h3>Channel Members</h3>
          <strong>Owner:</strong>
          <ul>
            <li>{channel?.owner}</li>
          </ul>
          <strong>Administrators:</strong>
          <ul>
            {channel?.administrator.map(admin => (
              <li key={admin}>{admin}</li>
            ))}
          </ul>
          <strong>Users:</strong>
          <ul>
            {channel?.userList.map(user => (
              <li key={user}>
                {user}
                <button onClick={() => makeAdministrator(user)}>Make Administrator</button>
              </li>
            ))}
          </ul>
          <strong>Invited Users:</strong>
          <ul>
            {channel?.invitedUsers.map(invitedUser => (
              <li key={invitedUser}>{invitedUser}</li>
            ))}
          </ul>
        </div>
        <MessageList messages={messages} />
        <div style={{ display: 'flex', marginTop: 'auto' }}>
          <MessageInput value={inputMessage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)} />
          <SendMessageButton onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
