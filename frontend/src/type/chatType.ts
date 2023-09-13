/*
* shared between frontend and backend
* below type
*/

export type ChannelType = 'public' | 'private' | 'protected';

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

export type ChannelId = string;

export type Message = {
  content: string;
  nickname: string;
};