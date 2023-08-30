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
    const allChannels = Array.from(this.channelMap.values());
    allChannels.forEach(channel => {
        console.log('channel id:', channel.id, 'channel title:', channel.title);
    });
    console.log('channel List :', this.channelMap);
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


