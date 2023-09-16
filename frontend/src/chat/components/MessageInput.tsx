import React from 'react';

function MessageInput({ value, onChange, onSubmit } : { value: string, onChange: (e : React.ChangeEvent<HTMLInputElement>) => void, onSubmit: () => void}) {
  return (
    <div onKeyDown={(e) => {
      if (e.key === 'Enter') {
        onSubmit();
      }}}>
      <input
        style={{ width: '100%', minWidth: '350px', height: '100%', padding: '0.5rem', fontSize: '1.2rem' }}
        type="text"
        value={value}
        onChange={onChange}
        placeholder="메시지를 입력하세요..."
      />
    </div>
  );
}

export default MessageInput;