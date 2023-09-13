import { ExecutionContext, HttpException, HttpStatus, createParamDecorator } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { plainToClass } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RedirectDto {
    @ApiProperty({
        description: '리디렉션 경로',
        example: '/auth/signup | /auth/signin | /auth/qr | /auth/no-2fa-signin',
        required: true,
    })
    redirectUrl: RedirectUrl;
}

export type RedirectUrl = '/auth/signup' | '/auth/signin' | '/auth/qr' | '/auth/no-2fa-signin';

export class DefaultDto {
    @ApiProperty({
        description: '메세지',
        example: 'message',
        required: true,
    })
    message: string;
}

export class CodeDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class SignupDto {
    @ApiProperty({
        description: '이메일',
        example: 'email@email.com',
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @ApiProperty({
        description: '닉네임',
        example: 'nickname',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    nickname: string;
    @ApiProperty({
        description: '아바타',
        example: 'image to string 값',
        required: true,
    })
    @IsString()
    avatar: string;
}

class CookieValueDto {
  @IsString()
  @IsNotEmpty()
  oauth_token: string;
}

export class OauthDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
  secret_valid_until: number;
}
/**
 * CookieValue Custom Decorator
 */
export const CookieValue = createParamDecorator(async (data: unknown, ctx: ExecutionContext): Promise<string> => {
  const request = await ctx.switchToHttp().getRequest();
  const oauthCookie = request.cookies['oauth-token'];
  plainToClass(OauthDto, { oauthCookie });
  return oauthCookie.access_token;
});