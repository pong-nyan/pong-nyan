import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { Channel } from 'src/type/chatType';
import { UseGuards } from '@nestjs/common';

// TODO: Add guard
@Controller('chat')
@ApiTags('chat')
@UseGuards()
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Get('public-list')
  getPublicChannels(): Channel[] {
    return this.chatService.getPublicChannels();
  }
}
