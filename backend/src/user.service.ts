import { Injectable } from '@nestjs/common';
import { UserInfo, IntraId} from 'src/type/userType';
import { SocketId, Socket } from 'src/type/socketType';
import { JwtService } from '@nestjs/jwt';
import { PnPayloadDto } from 'src/dto/pnPayload.dto';
import * as cookie from 'cookie';

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService) {}

    userMap = new Map<number, UserInfo>();
    idMap = new Map<SocketId, IntraId>();

    getIntraId(clientId: SocketId) { return this.idMap.get(clientId); }
    getUserInfo(intraId: number) { return this.userMap.get(intraId); }

    checkPnJwt(client: Socket) {
      console.log('in the checktPnJwt');
      const cookies = client.handshake.headers.cookie;
      console.log('cookies', cookies);
      if (!cookies) {
        console.error('Cookies not found');
        return false;
      }
      const pnJwtCookie = cookie.parse(cookies)['pn-jwt'];

      if (!pnJwtCookie) {
        console.error('JWT not found');
        return false;
      }
      try {
        const payload: PnPayloadDto = this.jwtService.verify<PnPayloadDto>(pnJwtCookie);
        if (payload.exp * 1000 < Date.now()) {
          console.error('JWT expired');
          return false;
        }
        console.log('client', client.id);
      } catch (err) {
        console.error('JWT verification failed', err);
        return false;
      }
      return true;
    }

    setUserMap(intraId : IntraId, userInfo: UserInfo) {
      this.userMap.set(intraId, userInfo);
    }

    setIdMap(clientId: SocketId, intraId: IntraId) {
      console.log('setIdMap clientId, intraId', clientId, intraId);
      this.idMap.set(clientId, intraId);
      console.log('setIdMap idMap', this.idMap);
    }

    // deleteIdMap(clientId: SocketId) {
    //   console.log('deleteIdMap', clientId);
    //   this.idMap.delete(clientId);
    // }

    deleteIdMap(clientId: SocketId) {
      console.log('deleteIdMap', clientId);
      if (this.idMap.delete(clientId)) {
        console.log(`Successfully deleted clientId: ${clientId}`);
      } else {
        console.log(`Failed to delete clientId: ${clientId}`);
      }
    }

    deleteUserMap(clientId: SocketId) {
      // TODO: 다시 생각해보기
      console.log('deleteUserMap', clientId);
      // const intraId = this.idMap.get(clientId);
      // this.idMap.delete(clientId);
      // this.userService.deleteUserMap(intraId);
    }

    leaveGameRoom(intraId: IntraId) {
      const userInfo = this.userMap.get(intraId);
      if (!userInfo) return ;
      userInfo.gameRoom = '';
    }


    /* -------------------------------------------------------------------- */

}
