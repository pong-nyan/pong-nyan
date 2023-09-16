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
      style={{ width: '100%', minWidth: '350px', height: '100%', padding: '0.5rem', fontSize: '1.2rem' }}
      placeholder="메시지를 입력하세요..."
    />
  );
}

export default MessageInput;