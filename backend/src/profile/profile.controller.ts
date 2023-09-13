import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { User } from 'src/entity/User';
import { UserDto } from './profile.dto';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('profile')
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiTags('profile')
  @ApiOperation({ summary: 'get user profile', description: '유저의 프로필을 가져온다.' })
  @ApiParam({ name: 'nickname', description: '유저의 닉네임', required: true })
  @Get(':nickname')
  async getInfo(@Param('nickname') nickname: string): Promise<User> {
    return await this.profileService.getInfo(nickname);
  }

  @Post('update')
  async updateInfo(@PnJwtPayload() pnPayload: PnPayloadDto, @Body() userInfo: UserDto): Promise<User> {
    const intraId = pnPayload.intraId;
    return await this.profileService.updateInfo(userInfo, intraId);
  }
}
