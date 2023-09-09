import { Injectable } from '@nestjs/common';
import { UserInfo, IntraId} from 'src/type/userType';
import { SocketId, Socket } from 'src/type/socketType';
import { JwtService } from '@nestjs/jwt';
import { PnPayloadDto } from 'src/chat/channel.dto';
import * as cookie from 'cookie';

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService) {}

    userMap = new Map<number, UserInfo>();
    idMap = new Map<SocketId, IntraId>();

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
        client.intraId = payload.intraId;
        console.log('client', client.id);
        console.log('client.intraId', client.intraId);
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
      this.idMap.set(clientId, intraId);
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
