import { PendingFriendProps } from '@/type/friendType';

const pendingFriend = ({ pendingFriend }: PendingFriendProps) => {
  return (
    <>
      <div>
        <p>닉네임</p>
        <p>{pendingFriend.nickname}</p>
      </div>
      <div>
        <p>요청한 날짜 </p>
        <p>{pendingFriend.createdAt}</p>
      </div>
      <div>
        <button>수락</button>
        <button>거절</button>
      </div>
    </>
  );
};

export default pendingFriend;