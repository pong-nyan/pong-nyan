import styles from '@/styles/CreateChannel.module.css';
import { socket } from '@/context/socket';

const MakeChannelButton = () => {
    
  const makeChannel = () => {
    const channelName = prompt('채널 이름을 입력하세요');
    if (!channelName) return ;
    socket.emit('channel-make', channelName);
    // const channelPassword = prompt('채널 비밀번호를 입력하세요');
    // if (!channelPassword) return ;
    // socket.emit('channel-password', channelPassword);

    // const channelRange = prompt('채널 범위를 입력하세요');
    // if (!channelRange) return ;
    // socket.emit('channel-range', channelRange);

  };
    
  return (
    <button onClick={makeChannel} className={styles.MakeChannelButton}>make channel</button>
  );
};

export default MakeChannelButton;