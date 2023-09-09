import { Controller, Get, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiTags } from '@nestjs/swagger';
import { Profile } from 'src/entity/Profile';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor( private readonly profileService: ProfileService) {}

  @Get('/')
  // TODO: check nickname is unique;
  async getInfo(@Query('nickname') nickname: string): Promise<Profile> {
    return await this.profileService.getInfo(nickname);
  }
}
