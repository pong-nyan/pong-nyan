import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { PnPayloadDto } from './game.dto';

/**
 * GameGuard
 * description: pn-jwt 를 decode 하여 payload 를 client.user 에 저장함.
 */
@Injectable()
export class GameGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('GameGuard');
    const client = context.switchToWs().getClient();
    const cookies = client.handshake.headers.cookie;
    const pnJwtCookie = cookie.parse(cookies)['pn-jwt'];

    if (!pnJwtCookie) return false;
    try {
      const payload = this.jwtService.verify<PnPayloadDto>(pnJwtCookie);
      // payload 의 exp  < 현재시간 이면 false
      if (payload.exp * 1000 < Date.now()) return false;
      client.user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }
}
