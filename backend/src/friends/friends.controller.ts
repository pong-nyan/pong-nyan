import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService
    ) {}

    @Get()
    async getFriends(@Query('intraId') intraId: number) {
        return await this.friendsService.getFriends(intraId);
    }

    @Post('add')
    async addFriend(@Query('intraId') intraId: number, @Query('friendId') friendId: number) {
        return await this.friendsService.addFriend(intraId, friendId);
    }
}
