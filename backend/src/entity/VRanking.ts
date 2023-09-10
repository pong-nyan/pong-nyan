import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'v_ranking',
    expression: connection => connection.createQueryBuilder()
        .select('user.nickname', 'nickname')
        .addSelect('user.rankScore', 'rankScore')
        .from('user', 'user')
        .orderBy('user.rankScore', 'DESC')
})
export class VRanking {
    @ViewColumn()
    nickname: string;

    @ViewColumn()
    rankScore: number;
}
