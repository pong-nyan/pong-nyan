import { RoomName } from './socketType';

/*
* shared between frontend and backend
* below type
*/

export type IntraId = number;

export type UserInfo = {
    nickname: string,
    chatRoomList: RoomName[],
    gameRoom: RoomName,
    online: boolean,
}
