declare module 'socket.io' {
  interface Socket {
    intraId?: string;
  }
}

/*
* shared between frontend and backend
* below type
*/

export type ChannelType = 'public' | 'private' | 'protected';

export type Channel = ChannelInfo & {
  id: string,
  owner: number,
  administrator: number[],
  userList: number[]
  invitedUsers: number[]
}

export type ChannelInfo = {
  title: string,
  password?: string,
  channelType: 'public' | 'private' | 'protected',
  maxUsers: number,
}

export type Message = {
  content: string;
  nickname: string;
};
