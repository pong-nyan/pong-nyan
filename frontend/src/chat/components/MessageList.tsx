import React from 'react';

function MessageList({ messages }: { messages: string[] }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {messages.map((message, index) => (
        // TODO: 여기에서 유저 아이디를 profile 컴포넌트로 넘겨줌
        // TODO: 띄워야 하는 요소는 이미지 유저의 아이디
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}

export default MessageList;