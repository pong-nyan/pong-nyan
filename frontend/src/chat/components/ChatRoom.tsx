import React, { useState, useEffect, useContext } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SendMessageButton from './SendMessageButton';
import { SocketContext } from '@/context/socket';
import { getMessagesFromLocalStorage, addMessageToLocalStorage } from '../utils/chatLocalStorage';
import { Message } from '@/type/chatType';

function ChatRoom({ channelId, selectedChannel, onLeaveChannel }: { channelId: string, selectedChannel: { title: string }, onLeaveChannel: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [channelUsers, setChannelUsers] = useState<string[]>([]);
  const socket = useContext(SocketContext);

  // 방이 눌렸을때 처리
  useEffect(() => {
    console.log('ChatRoom.tsx useEffect channelId', channelId);
    const loadedMessages = getMessagesFromLocalStorage(channelId);
    setMessages(loadedMessages);
  }, [channelId]);

  useEffect(() => {
    socket.on('chat-new-message', (data) => {
      const { message, channelId: receivedChannelId, sender } = data;

      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const loggedInUserId = loggedInUser.intraId;
      if (sender === loggedInUserId) return;
      addMessageToLocalStorage(receivedChannelId, message);
      if (channelId === receivedChannelId) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });
    return () => {
      socket.off('chat-new-message');
    };
  }, [channelId]);

  useEffect(() => {
    socket.on('chat-update-users', (users) => {
      setChannelUsers(users);
    });

    return () => {
      socket.off('chat-update-users');
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newMessage = {
        content: inputMessage,
        nickname: loggedInUser.nickname
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      addMessageToLocalStorage(channelId, newMessage);
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
          <strong>Current Channel:</strong> {selectedChannel.title}
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