import { ExecutionContext, HttpException, HttpStatus, createParamDecorator } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { plainToClass } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RedirectDto {
    @ApiProperty()
    redirectUrl: RedirectUrl;
}

export type RedirectUrl = '/auth/signup' | '/auth/signin' | '/auth/qr';

export class DefaultDto {
    @ApiProperty()
    message: string;
}

export class CodeDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class SignupDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    nickname: string;
    @IsNotEmpty()
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