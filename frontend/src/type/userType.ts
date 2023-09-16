import { RoomName } from './socketType';

export type UserInfo = {
  nickname: string,
  chatRoomList: RoomName[],
  gameRoom: RoomName,
  online: boolean,
  blockList: Nickname[],
}

/*
* shared between frontend and backend
* below type
*/

export type IntraId = number;

export type Nickname = string;

