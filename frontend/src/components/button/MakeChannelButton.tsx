import styles from '@/styles/CreateChannel.module.css';

const MakeChannelButton = ({ onMakeChannel }) => {

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px'
    }}>
      <button onClick={onMakeChannel} style={{
        width: '50px',
        height: '50px',
        border: 'none',  // 버튼의 기본 테두리를 제거
        background: 'none',  // 버튼의 기본 배경을 제거
        cursor: 'pointer',
        padding: 0,  // 버튼의 기본 패딩 제거
      }} >
        <img src='/assets/icon-plus.png' alt='make channel' style={{
          width: '100%',
          height: '100%',
        }} />
      </button>
    </div>
  );
};

export default MakeChannelButton;