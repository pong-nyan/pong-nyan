import { Inject, Injectable } from '@nestjs/common';
import { UserInfo, IntraId} from 'src/type/userType';
import { SocketId, Socket } from 'src/type/socketType';
import { JwtService } from '@nestjs/jwt';
import { PnPayloadDto } from 'src/dto/pnPayload.dto';
import * as cookie from 'cookie';


@Injectable()
export class UserService {
    constructor(
      private readonly jwtService: JwtService,
      ) {}

    private userMap = new Map<IntraId, UserInfo>();
    private idMap = new Map<SocketId, IntraId>();

    public getIntraId(clientId: SocketId) { return this.idMap.get(clientId); }
    public getUserInfo(intraId: number) { return this.userMap.get(intraId); }

    public checkPnJwt(client: Socket) {
      const cookies = client.handshake.headers.cookie;
      if (!cookies) {
        console.error('Cookies not found');
        return undefined;
      }
      const pnJwtCookie = cookie.parse(cookies)['pn-jwt'];
      if (!pnJwtCookie) {
        console.error('JWT not found');
        return undefined;
      }

      try {
        const payload: PnPayloadDto = this.jwtService.verify<PnPayloadDto>(pnJwtCookie);
        if (payload.exp * 1000 < Date.now()) {
          console.error('JWT expired');
          return undefined;
        }
        return payload;
      } catch (err) {
        console.error('JWT verification failed', err);
        return undefined;
      }
    }

    public setUserMap(intraId : IntraId, userInfo: UserInfo) {
      console.log('(Before) setUserMap : ', this.userMap);
      this.userMap.set(intraId, userInfo);
      console.log('(After) setUserMap : ', this.userMap);
    }

    public setIdMap(clientId: SocketId, intraId: IntraId) {
      console.log('(Before) setIdMap idMap : ', this.idMap);
      this.idMap.set(clientId, intraId);
      console.log('(After) setIdMap idMap : ', this.idMap);
    }
    setUserInfoChatRoomList(intraId: IntraId, channelId: string) {
      console.log('setUserInfoChatRoomList', intraId, channelId);
      const userInfo = this.getUserInfo(intraId);
      console.log('setUserInfoChatRoomList userInfo', userInfo);
      if (!userInfo) {
        console.error(`User with intraId ${intraId} not found.`);
        return ;
      }
      if (!userInfo.chatRoomList) {
        userInfo.chatRoomList = [];
      }

      if (!userInfo.chatRoomList.includes(channelId)) {
        userInfo.chatRoomList.push(channelId);
      }
      this.setUserMap(intraId, userInfo);
      console.log('setUserInfoChatRoomList userMap', this.userMap);
    }

    deleteUserInfoChatRoomList(intraId: IntraId, channelId: string) {
      console.log('deleteUserInfoChatRoomList', intraId, channelId);
      const userInfo = this.getUserInfo(intraId);
      if (!userInfo) {
        console.error(`User with intraId ${intraId} not found.`);
        return ;
      }
      if (!userInfo.chatRoomList || userInfo.chatRoomList.length === 0) {
        console.warn(`User with intraId ${intraId} has no chat rooms to delete.`);
        return;
      }

      userInfo.chatRoomList = userInfo.chatRoomList.filter((remainChannelId) => remainChannelId !== channelId);
      this.setUserMap(intraId, userInfo);
      console.log('deleteUserInfoChatRoomList userMap', this.userMap);
    }

    deleteUserMap(clientId: SocketId) {
      // TODO: 다시 생각해보기
      console.log('deleteUserMap', clientId);
      // const intraId = this.idMap.get(clientId);
      // this.idMap.delete(clientId);
      // this.userService.deleteUserMap(intraId);
    }

    public deleteIdMap(clientId: SocketId) {
      console.log('(Before) deleteIdMap : ', this.idMap);
      this.idMap.delete(clientId);
      console.log('(After) deleteIdMap : ', this.idMap);
    }

    public setGameRoom(intraId: IntraId, roomName: string) {
      const userInfo = this.userMap.get(intraId);
      if (!userInfo) return ;
      userInfo.gameRoom = roomName;
      console.log('[userService] setGameRoom', this.userMap);
    }

    public deleteGameRoom(intraId: IntraId) {
      const userInfo = this.userMap.get(intraId);
      if (!userInfo) return ;
      userInfo.gameRoom = '';
      console.log('[userService] deleteGameRoom', this.userMap);
    }

    /* -------------------------------------------------------------------- */

    public getUserInfoByIntraIdList(intraIdList: IntraId[]) {
      if (!intraIdList) return [];
      const userNicknameList = [];
      for (const intraId of intraIdList) {
        userNicknameList.push((this.userMap.get(intraId)).nickname);
      }

    }


}
