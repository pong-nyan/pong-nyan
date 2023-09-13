import { socket } from '@/context/socket';
import { FriendProps } from '@/type/friendType';
import { UserInfo } from '@/type/userType';

export const socketEmitFriendOnlineListEvent = (friends: FriendProps[] | undefined) => {
  if (!friends) return ;
  const intraIdList = friends.map((friend) => friend.intraId);
  socket.emit('friend-online-list', {
    intraIdList,
  });
};

export const socketOnFriendOnlineListEvent = (setFriendOnlineList: React.Dispatch<React.SetStateAction<UserInfo[] | undefined>>) => {
  socket.on('friend-online-list', (userInfoList: UserInfo[]) => {
    setFriendOnlineList(userInfoList);
  });
};
