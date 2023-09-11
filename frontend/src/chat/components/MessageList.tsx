import React from 'react';
import { Message } from '@/type/chatType';
import Link from 'next/link';

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <Link href={`/profile/${message.nickname}`}>
            <strong>{message.nickname}</strong>
          </Link>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
