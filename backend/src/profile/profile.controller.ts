import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {

  // TODO: after table setting, change this code
  // @Get('/')
  // async getInfo(@Query('intraId') intraId: number): Promise<Profile> {
  //   return await this.profileService.getInfo(intraId);
  // }
}
