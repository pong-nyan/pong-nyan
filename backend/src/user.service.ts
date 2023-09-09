import { Injectable } from '@nestjs/common';
import { UserInfo, IntraId} from 'src/type/userType';
import { SocketId } from 'src/type/socketType';

@Injectable()
export class UserService {
    userMap = new Map<number, UserInfo>();
    idMap = new Map<SocketId, IntraId>();

    addUser(userInfo: UserInfo, clientId: SocketId) {
      this.userMap.set(userInfo.intraId, userInfo);
      this.idMap.set(clientId, userInfo.intraId);
    }

    removeUser(clientId: SocketId) {
      console.log('removeUser', clientId);
      // const intraId = this.idMap.get(clientId);
      // this.idMap.delete(clientId);
      // this.userService.removeUser(intraId);
    }

    getIntraId(clientId: SocketId) {
      return this.idMap.get(clientId);
    }

    getUserInfo(clientId: SocketId) {
      const intraId = this.getIntraId(clientId);
      return this.getUser(intraId);
    }

    getUser(intraId: number) {
        return this.userMap.get(intraId);
    }
}
