import { Socket, SocketId, RoomName } from './socketType';

export type UserInfo = {
  client: { game: Socket | undefined, chat: Socket | undefined},
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
export type Nickname = string;

export type IntraId = number;

