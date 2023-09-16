import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsString()
    avatar: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
export class UserUpdateDto {
    @IsString()
    nickname: string;

    @IsString()
    avatar: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsBoolean()
    google2faOption: boolean;
}