import { Injectable } from '@nestjs/common';
import { UserInfo, IntraId} from 'src/type/userType';
import { SocketId, Socket } from 'src/type/socketType';
import { JwtService } from '@nestjs/jwt';
import { PnPayloadDto } from 'src/chat/channel.dto';
import * as cookie from 'cookie';

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService) {}

    userMap = new Map<IntraId, UserInfo>();
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

    setUserInfoChatRoomList(intraId: IntraId, channelId: string) {
      const userInfo = this.getUser(intraId);
      if (!userInfo) {
        console.error(`User with intraId ${intraId} not found.`);
        return;
      }
      if (!userInfo.chatRoomList) {
        userInfo.chatRoomList = [];
      }

      userInfo.chatRoomList.push(channelId);
      this.setUserMap(intraId, userInfo);
      console.log('setUserInfoChatRoomList userMap', this.userMap);
    }

    deleteUserInfoChatRoomList(intraId: IntraId, channelId: string) {
      const userInfo = this.getUser(intraId);
      if (!userInfo) {
        console.error(`User with intraId ${intraId} not found.`);
        return;
      }

      if (!userInfo.chatRoomList || userInfo.chatRoomList.length === 0) {
        console.warn(`User with intraId ${intraId} has no chat rooms to delete.`);
        return;
      }

      userInfo.chatRoomList = userInfo.chatRoomList.filter((remainChannelId) => remainChannelId !== channelId);
      this.setUserMap(intraId, userInfo);
    }

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

    getIntraId(clientId: SocketId) {
      console.log('getIntraId clientId', clientId);
      console.log('getIntraId', this.idMap.get(clientId));
      console.log('getIntraId idMap', this.idMap);

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
