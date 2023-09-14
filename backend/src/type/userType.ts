import { Socket, SocketId, RoomName } from './socketType';

/*
* shared between frontend and backend
* below type
*/
export type Nickname = string;

export type IntraId = number;

export type UserInfo = {
  client: { game: Socket | undefined, chat: Socket | undefined},
  nickname: string,
  chatRoomList: RoomName[],
  gameRoom: RoomName,
  online: boolean,
}
