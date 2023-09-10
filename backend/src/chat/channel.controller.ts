import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { Channel } from 'src/type/chatType';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { UseGuards } from '@nestjs/common';

@Controller('channel')
@ApiTags('channel')
@UseGuards()
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {
  }

  @Get('public-list')
  getPublicChannels(): Channel[] {
    return this.channelService.getPublicChannels();
  }
}
