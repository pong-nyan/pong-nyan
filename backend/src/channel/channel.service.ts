import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Channel, ChannelInfo } from '../type/channel';

@Injectable()
export class ChannelService {
  channelMap = new Map<string, Channel>();

  // 사용자가 채널을 추가
  addChannel(channelInfo: ChannelInfo, client: Socket, intraId: string) {
    console.log('service addChannel, channelInfo', channelInfo);
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
    console.log('channel List :', this.channelMap);
  }

  // 채널이 사용자를 추가
  joinChannel(channelId: string, userId: string) {
    console.log('service joinChannel, channelId, userId', channelId, userId);

    const channel = this.channelMap.get(channelId);
    console.log('service joinChannel, channelMap.get channel', channel);
    if (!channel) return; // 채널이 없다면 종료

    if (!channel.userList) {
        channel.userList = []; // 사용자 목록 초기화
    }

    if (!channel.userList.includes(userId)) {
        channel.userList.push(userId);
    }
  }

  leaveChannel(channelId: string, userId: string) {
    const channel = this.channelMap.get(channelId);
    if (channel) {
      const index = channel.userList.indexOf(userId);
      if (index > -1) {
        channel.userList.splice(index, 1);
      }
    }
  }

  getChannelUsers(channelId: string): string[] {
    const channel = this.channelMap.get(channelId);
    return channel ? channel.userList : [];
  }

  getChannelMap() {
    return this.channelMap;
  }

  getPublicChannels() {
    return Array.from(this.channelMap.values()).filter(channel => channel.channelType === 'public' || channel.channelType === 'protected');
  }

  getChannel(title: string) {
    return this.channelMap.get(title);
  }

  deleteChannel(title: string) {
    return this.channelMap.delete(title);
  }
}
