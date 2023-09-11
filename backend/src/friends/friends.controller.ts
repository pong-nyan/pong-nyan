import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { PnPayloadDto } from 'src/dto/pnPayload.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetIntraIdDto, PostFriendDto, PostFriendStatusDto } from './friends.dto';
import { PnJwtPayload } from 'src/dto/pnPayload.dto';
import Friend from 'src/entity/Friend';

@UseGuards(AuthGuard)
@ApiTags('friends')
@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
        ) {}

    @Get('/')
    @ApiTags('friends')
    @ApiOperation({ summary: 'get friends', description: '친구 목록을 가져온다.' })
    async getFriends(@Query() query: GetIntraIdDto) {
        const intraId = query.intraId;
        return await this.friendsService.getFriends(intraId);
    }

    @Get('/me')
    @ApiTags('friends')
    @ApiOperation({ summary: 'get friends', description: '나와의 친구 목록을 가져온다.' })
    async getMyFriends(@PnJwtPayload() pnPayload: PnPayloadDto) {
        const intraId = pnPayload.intraId;
        return await this.friendsService.getFriends(intraId);
    }

    @Get('/me/accepted')
    @ApiTags('friends')
    @ApiOperation({ summary: 'get accepted friends', description: '나와의 수락된 친구 목록을 가져온다.' })
    async getAcceptedFriends(@PnJwtPayload() pnPayload: PnPayloadDto) {
        const intraId = pnPayload.intraId;
        return await this.friendsService.getAcceptedFriends(intraId);
    }
    @Get('/me/accepted/test')
    @ApiTags('friends')
    @ApiOperation({ summary: 'get accepted friends', description: '테스트용. 인트라 id 직접 입력. 입력한 intraId 와의 수락된 친구 목록을 가져온다.' })
    async testGetAcceptedFriends(@Query() query: GetIntraIdDto) {
        const intraId = query.intraId;
        return await this.friendsService.getAcceptedFriends(intraId);
    }

    @Post('/')
    @ApiTags('friends')
    @ApiOperation({ summary: 'request friend', description: '친구 요청을 보낸다. 본인만 가능' })
    @ApiResponse({ status: 200, description: '친구 요청 성공', type: Friend })
    async requestFriend(@PnJwtPayload() pnPayload: PnPayloadDto, @Body() { friendIntraId }: PostFriendDto) {
        const intraId = pnPayload.intraId;
        return await this.friendsService.addFriend(intraId, friendIntraId);
    }

    @Post('/test')
    @ApiTags('friends')
    @ApiOperation({ summary: 'request friend', description: '테스트용. 인트라 id 를 입력해서 친구 요청을 보낸다' })
    async testRequestFriend(@Query() query: GetIntraIdDto, @Body() { friendIntraId }: PostFriendDto) {
        const intraId = query.intraId;
        return await this.friendsService.addFriend(intraId, friendIntraId);
    }

    @Post('/status')
    @ApiTags('friends')
    @ApiOperation({ summary: 'accept friend', description: '친구 요청을 수락/거절 한다. 본인만 가능' })
    async createFriendStatus(@PnJwtPayload() pnPayload: PnPayloadDto, @Body() { friendId, status }: PostFriendStatusDto) {
        const intraId = pnPayload.intraId;
        const friend = await this.friendsService.validateAcceptFriend(intraId, friendId);
        return await this.friendsService.updateFriendStatus(intraId, friend, status);
    }

    @Post('/status/test')
    @ApiTags('friends')
    @ApiOperation({ summary: 'accept friend', description: '테스트용. 인트라 id 직접 입력. 친구 요청을 수락한다.' })
    async testAcceptFriend(@Query() query: GetIntraIdDto, @Body() { friendId, status }: PostFriendStatusDto) {
        const intraId = query.intraId;
        const friend = await this.friendsService.validateAcceptFriend(intraId, friendId);
        return await this.friendsService.updateFriendStatus(intraId, friend, status);
    }
}
