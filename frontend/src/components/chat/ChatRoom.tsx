import React, { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SendMessageButton from './SendMessageButton';

function ChatRoom() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, inputMessage]);
      setInputMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      chatROMM
      <MessageList messages={messages} />
      <div style={{ display: 'flex', marginTop: 'auto' }}>
        <MessageInput value={inputMessage} onChange={(e : React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)} />
        <SendMessageButton onClick={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatRoom;