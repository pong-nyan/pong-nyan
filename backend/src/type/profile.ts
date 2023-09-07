import { IsNotEmpty } from 'class-validator';

export class ProfileDTO {
    @IsNotEmpty()
    @IsNumber()
    id: number;
    intarId: number;
    nickname: string ;
    avatar: string ;
    rank_score: number;
    gameInfo: JSON;
}
