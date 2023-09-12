import { RoomName } from './socketType';

/*
* shared between frontend and backend
* below type
*/

export type IntraId = number;

export type Nickname = string;

export type UserInfo = {
    intraId: number,
    nickname: Nickname,
    chatRoomList: RoomName[],
    gameRoom: RoomName
}
