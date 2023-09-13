import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SendMessageButton from './SendMessageButton';
import { SocketContext } from '@/context/socket';
import { getMessagesFromLocalStorage } from '../utils/chatLocalStorage';
import { Message } from '@/type/chatType';
import { Channel } from '@/type/chatType';

function ChatRoom({ channelId, onLeaveChannel } : { channelId: string, onLeaveChannel: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [channelUsers, setChannelUsers] = useState<string[]>([]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log('[Chat] 처음 접속시 localStorage에서 메시지 불러옴');
    const loadedMessages = getMessagesFromLocalStorage(channelId as string);
    setMessages(loadedMessages);
  }, [socket, channelId]);

  // 해당 채널에 들어와 있는 user의 목록을 받아옴
  useEffect(() => {
    socket.on('chat-update-users', (users) => {
      console.log('[Chat] chat-update-users users', users);
      setChannelUsers(users);
    });

    return () => {
      socket.off('chat-update-users');
    };
  }, [socket, channelId]);

  useEffect(() => {
    console.log('[Chat] 채널 정보를 서버에 요청함');
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
  }, [socket, channelId]);

  useEffect(() => {
    socket.on('chat-watch-new-message', (data)=>{
      console.log('[Chat] chat-watch-new-message', data);
      const { channelId: receivedChannelId } = data;
      const storageMessages = getMessagesFromLocalStorage(receivedChannelId);
      setMessages(storageMessages);
    });

    return () => {
      socket.off('chat-watch-new-message');
    };
  }, [socket, channelId]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newMessage : Message = {
        content: inputMessage,
        nickname: loggedInUser.nickname
      };
      // setMessages(prevMessages => [...prevMessages, newMessage]);
      // addMessageToLocalStorage(channelId as string, newMessage);
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