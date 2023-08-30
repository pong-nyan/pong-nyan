import styles from '@/styles/CreateChannel.module.css';
import { socket } from '@/context/socket';

const MakeChannelButton = () => {

  const makeChannel = () => {
    const title = prompt('방제를 입력하세요');
    if (!title) return ;
    const channelInfo = { title: title };

    socket.emit('chat-channel-make', channelInfo);
    console.log('makeCh channelInfo ', channelInfo);
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