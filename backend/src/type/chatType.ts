import { IntraId } from './userType';

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
  owner: IntraId,
  administrator: IntraId[],
  userList: ChanneUser[],
  invitedUsers: IntraId[],
  bannedUsers: IntraId[],
}

export type ChanneUser = {
  intraId: IntraId,
  nickname: string,
  exp: number,
}

export type ChannelInfo = {
  title: string,
  password?: string,
  channelType: ChannelType,
  maxUsers: number,
}

export type ChannelId = string;

export type Message = {
  content: string;
  nickname: string;
};
