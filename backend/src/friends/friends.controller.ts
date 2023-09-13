import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { PnPayloadDto } from 'src/dto/pnPayload.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetIntraIdDto, PostFriendDto, PostFriendStatusDto, PostFriendNicknameDto } from './friends.dto';
import { PnJwtPayload } from 'src/dto/pnPayload.dto';
import Friend from 'src/entity/Friend';
import { UserService } from 'src/user.service';

@UseGuards(AuthGuard)
@ApiTags('friends')
@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
        private readonly userService: UserService,
        ) {}

    @Get('/')
    @ApiTags('friends')
    @ApiOperation({ summary: 'get friends', description: '친구 목록을 가져온다.' })
    async getFriends(@Query() query: GetIntraIdDto) {
        const intraId = query.intraId;
        const friends = await this.friendsService.getFriends(intraId);
        // get friends info
        // const friendsInfo = [];
        // for (const friend of friends) {
            // const friendInfo = this.userService.getUserInfo(friend.friendId);
            // friendsInfo.push(friendInfo);
        // }
        return friends;
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

    @Get('/me/pending')
    @ApiTags('friends')
    @ApiOperation({ summary: 'get pending friends', description: '나와의 대기중인 친구 목록을 가져온다.' })
    async getPendingFriends(@PnJwtPayload() pnPayload: PnPayloadDto) {
        const intraId = pnPayload.intraId;
        return await this.friendsService.getPendingFriends(intraId);
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

    @Post('/request')
    @ApiTags('friends')
    @ApiOperation({ summary: 'request friend', description: '친구 요청을 보낸다. 본인만 가능 친구의 닉네임으로 요청을 보낸다.' })
    @ApiResponse({ status: 200, description: '친구 요청 성공', type: Friend })
    async requestFriendByNickname(@PnJwtPayload() pnPayload: PnPayloadDto, @Body() { friendNickname }: PostFriendNicknameDto) {
        const intraId = pnPayload.intraId;
        return await this.friendsService.addFriendByNickname(intraId, friendNickname);
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

    // @Post('/backdoor')
    // @ApiTags('friends')
    // @ApiOperation({ summary: 'backdoor', description: '5명은 pending, 5명은 accepted 상대로 mock friends를 생성한다.' })
    // async backdoor(@Body() { intraId }: GetIntraIdDto) {
    //     return await this.friendsService.generateMockFriends(intraId);
    // }
}
