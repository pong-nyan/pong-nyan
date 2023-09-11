import PendingFriendList from './PendingFriendList';
import RequestFriend from './RequestFriend';
import styles from '@/friend/styles/Manage.module.css';

const Manage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <PendingFriendList />
      </div>
      <RequestFriend />
    </div>
  );
};

export default Manage;