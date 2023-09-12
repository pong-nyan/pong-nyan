import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { Channel } from 'src/type/chatType';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { UseGuards } from '@nestjs/common';

@Controller('channel')
@ApiTags('channel')
@UseGuards()
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Get('public-list')
  getPublicChannels(): Channel[] {
    return this.chatService.getPublicChannels();
  }
}
