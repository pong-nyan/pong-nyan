import React from 'react';

function MessageInput({ value, onChange, onSubmit } : { value: string, onChange: (e : React.ChangeEvent<HTMLInputElement>) => void, onSubmit: () => void}) {
  return (
    <div onKeyDown={(e) => {
      if (e.key === 'Enter') {
        onSubmit();
      }}}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        style={{ flexGrow: 1 }}
        placeholder="메시지를 입력하세요..."
      />
    </div>
  );
}

export default MessageInput;