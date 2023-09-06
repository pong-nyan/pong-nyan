import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GameGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query['pn-jwt'];

    if (!token) {
      client.emit('redirect', { redirectUrl: '/auth/signin' });
    }

    try {
      const decoded = this.jwtService.verify(token);


      return true;
    } catch (err) {
      return false;
    }
  }
}
