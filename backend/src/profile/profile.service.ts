import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
  ) {}
  findOne(intraId: number): Profile {
    if (!intraId) return null;
    const userNickname = await this.profileRepository.findOne( where: {inraId: IntraId}, select: {
      id: nickname,
    });


    return 'This action returns a #${id} profile';
  }
}
