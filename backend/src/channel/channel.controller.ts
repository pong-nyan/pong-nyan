import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { Channel } from '../type/channel';
import { ChannelGuard } from './channel.guard';
import { UseGuards } from '@nestjs/common';

@Controller('channel')
@ApiTags('channel')
@UseGuards(ChannelGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {
  }

  @Get('public-list')
  getPublicChannels(): Channel[] {
    return this.channelService.getPublicChannels();
  }

}
