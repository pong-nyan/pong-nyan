import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VRanking } from 'src/entity/VRanking';
import { Repository } from 'typeorm';

@Injectable()
export class RankService {
    constructor(@InjectRepository(VRanking) private readonly vRankingRepository: Repository<VRanking>) { }

    async getRankInPage(page: number) {
        const [rankUser, total] = await this.vRankingRepository.findAndCount({
            select: ['intraNickname', 'rankScore'],
            skip: (page - 1) * 10,
            take: 10
        });
        return {
            rankUsers: rankUser,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / 10)
            }
        };
    }
}
