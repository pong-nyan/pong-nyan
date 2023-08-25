import React from 'react';

function MessageList({ messages }: { messages: string[]}) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}

export default MessageList;