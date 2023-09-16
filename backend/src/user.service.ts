import { Inject, Injectable } from '@nestjs/common';
import { UserInfo, IntraId, Nickname} from 'src/type/userType';
import { SocketId, Socket, RoomName } from 'src/type/socketType';
import { GameInfo } from 'src/type/gameType';
import { JwtService } from '@nestjs/jwt';
import { PnPayloadDto } from 'src/dto/pnPayload.dto';
import * as cookie from 'cookie';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User';
import { In, Repository } from 'typeorm';



@Injectable()
export class UserService {
    constructor(
      private readonly jwtService: JwtService,
      @InjectRepository(User) private readonly userRepository: Repository<User>,
      ) {}

    private userMap = new Map<IntraId, UserInfo>();
    private idMap = new Map<SocketId, IntraId>();

    public getIntraId(clientId: SocketId) { return this.idMap.get(clientId); }
    public getUserInfo(intraId: IntraId) { return this.userMap.get(intraId); }

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
      // console.log('(Before) setUserMap : ', this.userMap);
      this.userMap.set(intraId, userInfo);
      // console.log('(After) setUserMap : ', this.userMap);
    }

    // public setUniqueValue(clientId: SocketId, intraId: IntraId) {
    //   // 기존 Map을 훑어서 똑같은 value가 존재하는지 확인
    //   for (const [existingKey, existingValue] of this.idMap) {
    //     if (existingValue === intraId) {
    //       // 같은 value를 가진 키를 찾았다면 그 키를 지운다.
    //       this.idMap.delete(existingKey);
    //     }
    //   }
    // }

    public setIdMap(clientId: SocketId, intraId: IntraId) {
      // console.log('(Before) setIdMap idMap : ', this.idMap);
      // this.setUniqueValue(clientId, intraId);
      this.idMap.set(clientId, intraId);
      // console.log('(After) setIdMap idMap : ', this.idMap);
    }

    public setUserInfoChatRoomList(intraId: IntraId, channelId: string) {
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

    // deleteUserMap(clientId: SocketId) {
    //   // this.userService.deleteUserMap(intraId);
    // }

    public deleteIdMap(clientId: SocketId) {
      // console.log('(Before) deleteIdMap : ', this.idMap);
      this.idMap.delete(clientId);
      // console.log('(After) deleteIdMap : ', this.idMap);
    }

    public checkChatClient(clientId: SocketId, intraId: IntraId): UserInfo | undefined {
        const userInfo = this.getUserInfo(intraId);
        if (!userInfo || userInfo.client.chat.id !== clientId) return undefined;
        return userInfo;
    }

    public checkGameClient(clientId: SocketId, intraId: IntraId): UserInfo | undefined{
        const userInfo = this.getUserInfo(intraId);
        if (!userInfo || userInfo.client.game.id !== clientId) return undefined;
        return userInfo;
    }

    public setUserInfoGameRoom(roomName: RoomName, gameInfo: GameInfo) {
      const userInfoA = this.userMap.get(gameInfo.intraId.p1);
      const userInfoB = this.userMap.get(gameInfo.intraId.p2);
      if (!userInfoA || !userInfoB || userInfoA.gameRoom !== userInfoB.gameRoom) return ;
      userInfoA.client.game.join(roomName);
      userInfoB.client.game.join(roomName);
      userInfoA.gameRoom = roomName;
      userInfoB.gameRoom = roomName;
      console.log('[userService] setGameRoom', this.userMap);
    }

    public deleteUserInfoGameRoom(gameInfo: GameInfo) {
      console.log('[userService] Before deleteGameRoom', this.userMap);
      const userInfoA = this.userMap.get(gameInfo.intraId.p1);
      const userInfoB = this.userMap.get(gameInfo.intraId.p2);
      if (!userInfoA || !userInfoB || userInfoA.gameRoom !== userInfoB.gameRoom) return ;
      userInfoA.client.game?.leave(userInfoA.gameRoom);
      userInfoB.client.game?.leave(userInfoB.gameRoom);
      userInfoA.gameRoom = '';
      userInfoB.gameRoom = '';
      console.log('[userService] After deleteGameRoom', this.userMap);
    }

    public checkPossibleNickname(nickname: string) {
      return this.userRepository.findOne({ where: { nickname } });
    }

    /* -------------------------------------------------------------------- */

    public getUserInfoByIntraIdList(intraIdList: IntraId[]) {
      if (!intraIdList) return [];
      const userNicknameList = [];
      for (const intraId of intraIdList) {
        if (!this.userMap.has(intraId)) continue;
        userNicknameList.push((this.userMap.get(intraId)).nickname);
      }
      return userNicknameList;
    }

    public getUserInfoByNickname(nickname: Nickname) {
      if (!nickname) return null;
      return this.userRepository.findOne({ where: { nickname } });
    }
}
