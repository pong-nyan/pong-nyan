import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostFriendDto {
    @ApiProperty({
        description: '친구의 인트라 아이디',
        example: 99997,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => { return Number(value);})
    readonly friendIntraId: number;
}

export class PostFriendDtoNickname {
    @ApiProperty({
        description: '친구의 닉네임',
        example: 'seongyle',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    readonly friendNick: string;
}

export class PostFriendStatusDto {
    @ApiProperty({
        description: '친구 아이디. friend object 의 id를 넣으면 된다',
        example: 1,
        required: true})
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => { return Number(value);})
    readonly friendId: number;
    @ApiProperty({
        description: '친구 요청 수락/거절 여부',
        example: 'accepted | rejected',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    readonly status: 'accepted' | 'rejected';
}

export class GetIntraIdDto {
    @ApiProperty({
        description: '인트라 아이디',
        example: 99997,
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => { return Number(value);})
    readonly intraId: number;
}
