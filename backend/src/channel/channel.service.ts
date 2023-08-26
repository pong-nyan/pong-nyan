import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Channel, ChannelInfo } from '../type/channel';



@Injectable()
export class ChannelService {
  channelMap = new Map<string, Channel>();

  addChannel(channelInfo: ChannelInfo, client: Socket) {
    // add channel
    const channelId = uuidv4();
    const newChannel = {id: channelId, host: client.id, manager: [client.id], userList: [client.id], ...channelInfo };
    client.join(channelId);
    this.channelMap.set(channelId, newChannel);
    console.log('channel id :', this.channelMap[0].id);
    console.log('channel List :', this.channelMap);
  }

  getChannelMap() {
    return this.channelMap;
  }

  getChannel(channelTitle: string) {
    return this.channelMap.get(channelTitle);
  }

  deleteChannel(channelTitle: string) {
    return this.channelMap.delete(channelTitle);
  }

}


