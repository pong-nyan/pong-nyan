import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entity/Profile';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>
  ) {}

  async getInfo(nickname: string): Promise<Profile | null> {
    const profile = await this.profileRepository.findOne({ where: { nickname: nickname } });
    console.log('PROFILE', profile);
    return profile;
  }

  async createProfile (
    id: number,
    intraId: number,
    nickname: string,
    avatar: string,
    rankScore: number,
    winner: number,
    loser: number
  ) {
    const profile = new Profile();

    profile.id = id;
    profile.intraId = intraId;
    profile.nickname = nickname;
    profile.avatar = avatar;
    profile.rankScore = rankScore;
    profile.winner = winner;
    profile.loser = loser;

    const existProfile = await this.profileRepository.findOne({ where: { intraId: intraId } });
    if (!existProfile)
      return await this.profileRepository.update({ intraId: intraId }, profile);
    else
      return await this.profileRepository.save(profile);
  }
}
