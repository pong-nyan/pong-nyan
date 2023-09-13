import useAuth from '@/context/useAuth';
import PendingFriendList from './PendingFriendList';
import RequestFriend from './RequestFriend';
import styles from '@/friend/styles/Manage.module.css';

const Manage = () => {
  useAuth();
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