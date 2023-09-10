import { PendingFriendProps } from '@/type/friendType';
import styles from '@/friend/styles/PendingFriend.module.css';

const pendingFriend = ({ pendingFriend }: PendingFriendProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.nickname}>{pendingFriend.nickname}</p>
      <p className={styles.createdAt}>{pendingFriend.createdAt}</p>
      <div className={styles.buttons}>
        <button className={styles.acceptButton}>수락</button>
        <button className={styles.rejectButton}>거절</button>
      </div>
    </div>
  );
};

export default pendingFriend;