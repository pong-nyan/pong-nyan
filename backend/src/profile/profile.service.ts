import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/User';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getInfo(nickname: string): Promise<User | null> {
    const profile = await this.userRepository.findOne({
      select: ['intraId', 'nickname', 'avatar', 'rankScore', 'winnerGames', 'loserGames'],
      where: { nickname },
      relations: ['winnerGames', 'loserGames'],
    });
    return profile;
  }
}
