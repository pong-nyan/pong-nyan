import styles from '@/styles/CreateChannel.module.css';

const MakeChannelButton = ({onClick}) => {

  return (
    <button onClick={onClick} className={styles.MakeChannelButton}>make channel</button>
  );
};

export default MakeChannelButton;