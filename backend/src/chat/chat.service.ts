import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Channel, ChannelInfo, ChannelId } from 'src/type/chatType';
import { IntraId } from 'src/type/userType';
import { UserService } from 'src/user.service';
import { ChanneUser } from 'src/type/chatType';
import { Nickname } from 'src/type/userType';

@Injectable()
export class ChatService {
  constructor(private readonly userService : UserService) {}

  private channelMap = new Map<ChannelId, Channel>();

  // 사용자가 채널을 추가
  addChannel(channelInfo: ChannelInfo, client: Socket, intraId: number, nickname: string) : string {
    console.log('[ChatService] service addChannel, channelInfo', channelInfo);
    const channelId = uuidv4();
    const newChannel = {
      id: channelId,
      owner: intraId,
      administrator: [intraId],
      userList: [{ intraId, nickname, exp : -1 }],
      invitedUsers: [intraId],
      ...channelInfo };
    client.join(channelId);
    this.channelMap.set(channelId, newChannel);
    console.log('[ChatService] channel List :', this.channelMap);
    return channelId;
  }

  // 채널이 사용자를 추가
  joinChannel(channelId: ChannelId, userId: number, nickname: string) {
    console.log('[ChatService] service joinChannel, channelId, userId', channelId, userId);

    const channel = this.channelMap.get(channelId);
    console.log('[ChatService] service joinChannel, channelMap.get channel', channel);
    if (!channel) return; // 채널이 없다면 종료

    if (!channel.userList) {
        channel.userList = []; // 사용자 목록 초기화
    }
    if (!channel.userList.some(item => item.intraId === userId)) {
        channel.userList.push({ intraId: userId, nickname, exp: -1 });
    }
    this.userService.setUserInfoChatRoomList(userId, channelId);
  }

  leaveChannel(channelId: ChannelId, userId: number) {
    const channel = this.channelMap.get(channelId);
    if (channel) {
      const index = channel.userList.findIndex(item => item.intraId === userId);
      const index2 = channel.administrator.indexOf(userId);
      if (index > -1) {
        channel.userList.splice(index, 1);
      }
      if (index2 > -1) {
        channel.administrator.splice(index2, 1);
      }
    }
  }

  deleteChannel(channelId: string) {
    return this.channelMap.delete(channelId);
  }

  deleteAdministrator(channelId: string, userId: number) {
    const channel = this.channelMap.get(channelId);
    if (channel) {
      const index = channel.administrator.indexOf(userId);
      if (index > -1) {
        channel.administrator.splice(index, 1);
      }
    }
    return channel;
  }

  grantAdministrator(channelId: string, userId: number) {
    const channel = this.channelMap.get(channelId);
    if (channel) {
      channel.administrator.push(userId);
    }
    return channel;
  }

  getChannelUsers(channelId: ChannelId): ChanneUser[] {
    const channel = this.channelMap.get(channelId);
    return channel ? channel.userList : [];
  }

  getChannelMap() {
    return this.channelMap;
  }

  getPublicChannels() {
    return Array.from(this.channelMap.values()).filter(channel => channel.channelType === 'public' || channel.channelType === 'protected');
  }

  getChannel(channelId: string) {
    return this.channelMap.get(channelId);
  }

  findDm(myNickname: Nickname, opponentNickname: Nickname) {
    for (const value of this.channelMap.values()) {
      if ((value.userList.some(user => user.nickname === myNickname))
          && (value.userList.some(user => user.nickname === opponentNickname))) {
        return value;
      }
      return null;
    }
  }
}
