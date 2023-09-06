import React from 'react';

function MessageInput({ value, onChange } : { value: string, onChange: (e : React.ChangeEvent<HTMLInputElement>) => void}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      style={{ flexGrow: 1 }}
      placeholder="메시지를 입력하세요..."
    />
  );
}

export default MessageInput;