import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Channel, ChannelInfo } from '../type/channel';


@Injectable()
export class ChannelService {
  channelMap = new Map<string, Channel>();

  // 사용자가 채널을 추가
  addChannel(channelInfo: ChannelInfo, client: Socket) {
    const channelId = uuidv4();
    const newChannel = {id: channelId, host: client.id, manager: [client.id], userList: [client.id], ...channelInfo };
    client.join(channelId);
    this.channelMap.set(channelId, newChannel);
    const allChannels = Array.from(this.channelMap.values());
    allChannels.forEach(channel => {
        console.log('channel id:', channel.id, 'channel title:', channel.title);
    });
    console.log('channel List :', this.channelMap);
  }

  // 채널이 사용자를 추가
  joinChannel(channelId: string, userId: string) {
    const channel = this.channelMap.get(channelId);
    if (channel && !channel.userList.includes(userId)) {
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

  getChannel(title: string) {
    return this.channelMap.get(title);
  }

  deleteChannel(title: string) {
    return this.channelMap.delete(title);
  }

}


