import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/User';
import { UserDto } from './profile.dto';
import { IntraId } from 'src/type/userType';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getInfo(nickname: string): Promise<User | null> {
    const profile = await this.userRepository.findOne({
      select: ['id', 'intraId', 'nickname', 'avatar', 'rankScore', 'winnerGames', 'loserGames'],
      where: { nickname },
      relations: ['winnerGames', 'loserGames'],
    });
    return profile;
  }

  async updateInfo(userInfo: UserDto, intraId: IntraId): Promise<User | null> {
    const profile = await this.userRepository.findOne({
      where: { intraId },
    });
    if (!profile) return null;
    profile.nickname = userInfo.nickname;
    if (userInfo.avatar) {
      profile.avatar = userInfo.avatar;
    }
    profile.email = userInfo.email;
    profile.google2faOption = userInfo.google2faOption;
    await this.userRepository.save(profile);
    return profile;
  }
}
