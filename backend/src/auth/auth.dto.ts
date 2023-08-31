import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { plainToClass } from 'class-transformer';
import { IsString, IsNotEmpty, validateOrReject } from 'class-validator';

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


class CookieValueDto {
  @IsString()
  @IsNotEmpty()
  oauth_token: string;
}

class OauthDto {
  @IsString()
  @IsNotEmpty()
  oauth_token: string;
}
/**
 * CookieValue Decorator
 */
export const CookieValue = createParamDecorator(async (data: unknown, ctx: ExecutionContext): Promise<string> => {
  const request = ctx.switchToHttp().getRequest();
  const cookieValue = request.cookies['oauth-token'];
  
  const cookieValueDto = plainToClass(CookieValueDto, { oauth_token: cookieValue });
  try {
    await validateOrReject(cookieValueDto)
    const oauthToken = plainToClass(OauthDto, { oauth_token: cookieValueDto.oauth_token});
    return cookieValueDto.oauth_token;
  } catch(err) {
    throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
  } // class-validator를 이용한 검증
});