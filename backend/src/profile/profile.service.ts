import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/User';
import { UserDto, UserUpdateDto } from './profile.dto';
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

  async updateInfo(userInfo: UserUpdateDto, intraId: IntraId): Promise<User | null> {
    const profile = await this.userRepository.findOne({
      where: { intraId },
    });
    if (!profile) return null;
    profile.nickname = userInfo.nickname || profile.nickname;
    if (userInfo.avatar) {
      profile.avatar = userInfo.avatar || profile.avatar;
    }
    profile.email = userInfo.email || profile.email;
    profile.google2faOption = userInfo.google2faOption;
    await this.userRepository.update({ intraId }, profile);
    return profile;
  }
}
