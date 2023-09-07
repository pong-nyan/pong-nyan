import { Controller, Get, Query } from '@nestjs/common';
import { ProfileDTO } from 'src/type/profile';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @Get('/')
  async findOne(@JwtIntraId() intraId: number): Promise<ProfileDTO> {
    return await this.profileService.findOne(intarId);
  }
}
