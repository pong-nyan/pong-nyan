import { RoomName } from './socketType';

/* ------------------------------ */

export type IntraId = number;

export type UserInfo = {
    intraId: number,
    nickname: string,
    chatRoomList: RoomName[],
    gameRoom: RoomName
}
