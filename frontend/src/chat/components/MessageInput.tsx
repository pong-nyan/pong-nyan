import React from 'react';

function MessageInput({ value, onChange, onSubmit } : { value: string, onChange: (e : React.ChangeEvent<HTMLInputElement>) => void, onSubmit: () => void}) {

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyUp={handleKeyUp}
      style={{ flex: 1, padding: '10px', border: '1px solid gray' }}
      placeholder="메시지를 입력하세요..."
    />
  );
}

export default MessageInput;