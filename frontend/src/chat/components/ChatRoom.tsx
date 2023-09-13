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
  const [channel, setChannel] = useState<Channel | null>(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log('[Chat] 처음 접속시 localStorage에서 메시지 불러옴');
    const loadedMessages = getMessagesFromLocalStorage(channelId as string);
    setMessages(loadedMessages);
  }, [socket, channelId]);

  useEffect(() => {
    console.log('[Chat] 처음 접속했을때 채널 정보를 서버에 요청함');
    if (channelId) {
      console.log('[Chat] 처음 접속했을때 channelId 존재함');
      socket.emit('chat-request-channel-info', { channelId });
    }
  }, [socket, channelId]);

  useEffect(() => {
    console.log('[Chat] 접속해있는 URL의 channelId가 바뀔때마다 채널 정보를 서버에 요청함');
    if (channelId) {
      socket.on('chat-response-channel-info', (response) => {
        console.log('[Chat] chat-response-channel-info 받음', response);
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
  }, [socket, channel, channelId]);

  useEffect(() => {
    console.log('[Chat] 채널 정보를 서버에 다시 요청함');
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
              <li key={user}>{user}</li>
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