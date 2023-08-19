import { Body, ClassSerializerInterceptor, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Google2faService } from './google2fa.service';
import { AuthService } from 'src/auth/auth.service';


@Controller('google2fa')
export class Google2faController {
    constructor(
    private readonly google2faService: Google2faService,
    private readonly authService: AuthService,
  ) {}

  @Get('qr')
  //  TODO: Add AuthGuard
  async register(@Res() res: Response, @Req() request: Request) {
    //  cookie 로 부터 user 정보를 가져옴
    const { intraId } = await this.authService.getUserInfoFromCookie(request);
    const user = await this.authService.getUserInfoFromOurDB(intraId);
    const { otpAuthUrl } = await this.google2faService.generateTwoFactorAuthenticationSecret(user);

    return await this.google2faService.pipeQrCodeStream(res, otpAuthUrl);
  }
}