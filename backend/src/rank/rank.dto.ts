import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class RankUserDto {
    @IsNotEmpty()
    @IsString()
    nickname: string;
    @IsNotEmpty()
    @IsNumber()
    rankScore: number;
    @IsNotEmpty()
    @IsNumber()
    rank: number;
}

export class RankUserListDto {
    data: RankUserDto[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}