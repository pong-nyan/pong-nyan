import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { User } from 'src/entity/User';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiTags('profile')
  @ApiOperation({ summary: 'get user profile', description: '유저의 프로필을 가져온다.' })
  @ApiParam({ name: 'nickname', description: '유저의 닉네임', required: true })
  @Get(':nickname')
  async getInfo(@Param('nickname') nickname: string): Promise<User> {
    return await this.profileService.getInfo(nickname);
  }
}
