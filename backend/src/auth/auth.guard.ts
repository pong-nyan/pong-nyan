import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService : JwtService) {}

  // TODO : async 붙일지 말지 고려하기 (붙이면 verify-> verifyAsync로 바꿔야함)
  canActivate(context: ExecutionContext) : boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['jwt'];
    if (!token) {
      return false;
    }
    const payload = this.jwtService.verify(token);
    if (!payload) {
      return false;
    }
    request.user = payload;
    return true;
  }
}
