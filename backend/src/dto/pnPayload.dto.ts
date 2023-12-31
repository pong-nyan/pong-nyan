import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PnPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => { return Number(value);})
  intraId: number;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  intraNickname: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => { return Number(value);})
  iat: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => { return Number(value);})
  exp: number;
}

export class JwtDto {
  @IsNotEmpty()
  payload: PnPayloadDto;
}

/**
 * CookieValue Custom Decorator
 * description: 앞단에 UseGuards(ChannelGuard)가 필요함. jwt payload를 가져옴 (jwt payload는 client.user에 저장되어 있음).
 */
export const PnJwtPayload = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
  const client = ctx.switchToWs().getClient();
  const payload = client.user;
  return payload;
});
