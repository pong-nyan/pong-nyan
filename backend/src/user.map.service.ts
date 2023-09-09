import { Injectable } from '@nestjs/common';
import { UserInfo } from './type/channel';

@Injectable()
export class UserMapService {
    userMap = new Map<number, UserInfo>();

    addUser(userInfo: UserInfo) {
        this.userMap.set(userInfo.intraId, userInfo);
    }

    getUser(intraId: number) {
        return this.userMap.get(intraId);
    }

    deleteUser(intraId: number) {
        this.userMap.delete(intraId);
    }

}
