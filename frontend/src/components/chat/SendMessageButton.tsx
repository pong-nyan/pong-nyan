import React from 'react';

function SendMessageButton({ onClick }: { onClick: () => void}) {
  return (
    <button onClick={onClick} style={{ marginLeft: '10px' }}>
      보내기
    </button>
  );
}

export default SendMessageButton;