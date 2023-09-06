import { Module } from '@nestjs/common';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';

@Module({
  providers: [ChannelGateway, ChannelService],
  controllers: [ChannelController]
})
export class ChannelModule {}
