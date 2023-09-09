export type RankUserType = {
    nickname: string;
    rankScore: number;
    rank: number;
};

export type RankUserListProps = {
    rankUserList: RankUserType[];
};
 
export type RankUserProps = {
    rankUser: RankUserType;
};
