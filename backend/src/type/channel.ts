declare module 'socket.io' {
  interface Socket {
    intraId?: string;
  }
}

export type Channel = ChannelInfo & {
  id: string,
  owner: string,
  administrator: string[],
  userList: string[]
  invitedUsers: string[]
}

export type ChannelInfo = {
  title: string,
  password?: string,
  channelType: 'public' | 'private' | 'protected',
  maxUsers: number,
}

export type UserInfo = {
  intraId: number,
  nickname: string,
  online: boolean,
  roomList: string[]
}
