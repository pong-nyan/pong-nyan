import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChannelService {
  channelList = [ ];

  addChannel(channelTitle: string, client: Socket) {
    // add channel
    const channelId = uuidv4();

    client.join(channelId);
    this.channelList.push({id : channelId, title : channelTitle});
    console.log('channel id :', this.channelList[0].id);
    console.log('channel List :', this.channelList);
  }

  getChannelList() {
    return this.channelList;
  }

  getChannel(channelTitle: string) {
    return this.channelList.find((channel) => channel === channelTitle);
  }

  deleteChannel(channelTitle: string) {
    this.channelList = this.channelList.filter((channel) => channel !== channelTitle);
  }

}


