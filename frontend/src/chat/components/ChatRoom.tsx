import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SendMessageButton from './SendMessageButton';
import { SocketContext } from '@/context/socket';
import { getMessagesFromLocalStorage, addMessageToLocalStorage } from '../utils/chatLocalStorage';
import { Message } from '@/type/chatType';
import { Channel } from '@/type/chatType';
import { useRouter } from 'next/router';

function ChatRoom({ onLeaveChannel }: { onLeaveChannel: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [channelUsers, setChannelUsers] = useState<string[]>([]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const socket = useContext(SocketContext);
  const router = useRouter();
  const { channelId } = router.query;

  useEffect(() => {
    console.log('[Chat] 처음 접속시 localStorage에서 메시지 불러옴');
    const loadedMessages = getMessagesFromLocalStorage(channelId as string);
    setMessages(loadedMessages);
  }, []);

  useEffect(() => {
    socket.on('chat-update-users', (users) => {
      setChannelUsers(users);
    });

    return () => {
      socket.off('chat-update-users');
    };
  }, []);

  useEffect(() => {
    if (channelId) {
      socket.emit('chat-request-channel-info', { channelId });

      socket.on('chat-response-channel-info', (response) => {
        if (response.error) {
          alert(response.error);
        } else {
          setChannel(response.channel);
        }
      });

      return () => {
        socket.off('chat-response-channel-info');
      };
    }
  }, [channelId]);

  // 페이지에서 채팅의 내용을 바꾸기 위해
  useEffect(() => {
    socket.on('chat-new-message', (data) => {
      const { message, channelId: receivedChannelId } = data;

      if (channelId === receivedChannelId) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('chat-new-message');
    };
  }, [socket, channelId]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newMessage = {
        content: inputMessage,
        nickname: loggedInUser.nickname
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      addMessageToLocalStorage(channelId as string, newMessage);
      socket.emit('chat-message-in-channel', { channelId, message: newMessage });
      setInputMessage('');
    }
  };

  const handleLeaveChannel = () => {
    socket.emit('chat-leave-channel', channelId);
    onLeaveChannel();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '700px', minWidth: '370px', backgroundColor: 'ivory' }}>
        <div style={{ padding: '10px', borderBottom: '1px solid gray' }}>
          <strong>Current Channel:</strong> {channel?.title ? channel.title : 'No Channel Selected'}
          <button onClick={handleLeaveChannel}>Leave Channel</button>
        </div>
        <div style={{ padding: '10px', borderBottom: '1px solid gray' }}>
          <h3>Users in Channel</h3>
          <ul>
            {channelUsers.map(user => (
              <li key={user}>{user}</li>
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