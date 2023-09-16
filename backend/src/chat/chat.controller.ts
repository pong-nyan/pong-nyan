import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { Channel } from 'src/type/chatType';
import { UseGuards } from '@nestjs/common';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';

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

  @Post('/request')
  @ApiTags('chat')
  @ApiOperation({ summary: 'request dm', description: 'DM 요청을 보낸다.' })
  @ApiResponse({ status: 200, description: 'DM 요청 성공' })
  async requestFriendByNickname(@PnJwtPayload() pnPayload: PnPayloadDto) {
    pnPayload.intraId;
  }

}
