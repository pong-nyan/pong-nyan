/*
* shared between frontend and backend
* below type
*/

import { IntraId } from './userType';

export type ChannelType = 'public' | 'private' | 'protected';

export type Channel = ChannelInfo & {
  id: string,
  owner: IntraId,
  administrator: IntraId[],
  userList: ChanneUser[],
  invitedUsers: IntraId[]
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