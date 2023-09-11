import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/*
 * @Description:
 * - AuthGuard는 Oauth인증까지를 한 유저를 컨트롤러에서 확인하는 가드이다.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthGuard');
    //TODO: Oauth인증까지만 한 유저인지 확인하는 로직을 작성한다.
    return false;
  }
}



