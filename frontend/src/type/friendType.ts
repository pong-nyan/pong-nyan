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
}

export enum FriendStatus {
  OFFLINE = 0,
  ONLINE = 1,
  INGAME = 2,
}

export type FriendProps = {
  intraId: number;
  nickname: string;
  avatar: string;
  rankScore: number;
}