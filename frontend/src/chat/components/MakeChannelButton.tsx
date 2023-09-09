import styles from '@/chat/styles/MakeChannel.module.css';

const MakeChannelButton = ({ onMakeChannel }) => {

  return (
    <div className={styles.makeChannelButtonLayout} >
      <button onClick={onMakeChannel} style={{
        width: '50px',
        height: '50px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: 0,
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