import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Channel, ChannelInfo, ChannelId } from 'src/type/chatType';
import { IntraId } from 'src/type/userType';
import { UserService } from 'src/user.service';

@Injectable()
export class ChatService {
  constructor(private readonly userService : UserService) {}

  private channelMap = new Map<ChannelId, Channel>();

  // 사용자가 채널을 추가
  addChannel(channelInfo: ChannelInfo, client: Socket, intraId: number) : string {
    console.log('[ChatService] service addChannel, channelInfo', channelInfo);
    const channelId = uuidv4();
    const newChannel = {
      id: channelId,
      owner: intraId,
      administrator: [intraId],
      userList: [intraId],
      invitedUsers: [intraId],
      ...channelInfo };
    client.join(channelId);
    this.channelMap.set(channelId, newChannel);
    console.log('[ChatService] channel List :', this.channelMap);
    return channelId;
  }

  // 채널이 사용자를 추가
  joinChannel(channelId: ChannelId, userId: number) {
    console.log('[ChatService] service joinChannel, channelId, userId', channelId, userId);

    const channel = this.channelMap.get(channelId);
    console.log('[ChatService] service joinChannel, channelMap.get channel', channel);
    if (!channel) return; // 채널이 없다면 종료

    if (!channel.userList) {
        channel.userList = []; // 사용자 목록 초기화
    }
    if (!channel.userList.includes(userId)) {
        channel.userList.push(userId);
    }
    this.userService.setUserInfoChatRoomList(userId, channelId);
  }

  leaveChannel(channelId: ChannelId, userId: number) {
    const channel = this.channelMap.get(channelId);
    if (channel) {
      const index = channel.userList.indexOf(userId);
      if (index > -1) {
        channel.userList.splice(index, 1);
      }
    }
  }

  getChannelUsers(channelId: ChannelId): IntraId[] {
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

  deleteChannel(channelId: string) {
    return this.channelMap.delete(channelId);
  }

  grantAdministrator(channelId: string, userId: number) {
    const channel = this.channelMap.get(channelId);
    if (channel) {
      channel.administrator.push(userId);
    }
    return channel;
  }

}
