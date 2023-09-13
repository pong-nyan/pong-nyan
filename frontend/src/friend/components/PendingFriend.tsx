import { PendingFriendProps } from '@/type/friendType';
import styles from '@/friend/styles/PendingFriend.module.css';
import axios from 'axios';

const PendingFriend = ({ pendingFriend }: PendingFriendProps) => {
  const onClickAccept = () => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/status`, {
      friendId: pendingFriend.id,
      status: 'accepted'
    }).then((res) => {
      alert('수락되었습니다.');
      console.log(res);
    }).catch((err) => {
      console.error(err);
    });
  };

  const onClickReject = () => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/status`, {
      friendId: pendingFriend.id,
      status: 'rejected'
    }).then((res) => {
      alert('거절되었습니다.');
      console.log(res);
    }).catch((err) => {
      console.error(err);
    });
  };

  return (
    <div className={styles.container}>
      <p className={styles.nickname}>{pendingFriend.nickname}</p>
      <p className={styles.createdAt}>{pendingFriend.createdAt}</p>
      <div className={styles.buttons}>
        <button className={styles.acceptButton} onClick={onClickAccept} >수락</button>
        <button className={styles.rejectButton} onClick={onClickReject} >거절</button>
      </div>
    </div>
  );
};

export default PendingFriend;