import React from 'react';
import { Message } from '@/type/chatType';

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          {/* TODO: 여기에서 유저 아이디를 profile 컴포넌트로 넘겨줌 */}
          <strong>{message.nickname}</strong>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
