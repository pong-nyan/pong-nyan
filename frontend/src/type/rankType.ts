export type RankUserType = {
    nickname: string;
    rankScore: number;
    rank: number;
};

export type RankUserListProps = {
    rankUserList: RankUserType[];
    currentPage: number;
};
 
export type RankUserProps = {
    rankUser: RankUserType;
    rank: number;
};

export type PaginationProps = {
    currentPage: number;
    handleCurrentPage: (page: number) => void;
};
  