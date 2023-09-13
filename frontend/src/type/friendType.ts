export type PendingFriend = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestUser: any;
  nickname: string,
  id: number,
  createdAt: string,
}

export type PendingFriendProps = {
  pendingFriend: PendingFriend,
  key: number,
  friendId: number,
}


type SocketInfo = {
  chatRoomList : Array<string>,
  gameRoom : string,
  nickname : string,
  online : boolean 
}

export type FriendProps = {
  intraId: number;
  nickname: string;
  avatar: string;
  rankScore: number;
  socketInfo: SocketInfo; 
}