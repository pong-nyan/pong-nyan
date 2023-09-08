import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class RankService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async getRankInPage(page: number) {
        const [rankUser, total] = await this.userRepository.findAndCount({
            select: ['intraNickname', 'rankScore'],
            order: { rankScore: 'DESC' },
            skip: (page - 1) * 10,
            take: 10
        });
        return {
            data: rankUser,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / 10)
            }
        };
    }
}
