import { Body, ClassSerializerInterceptor, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

@Controller('google2fa')
export class Google2faController {
  //   constructor(
  //   // private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
  // ) {}
  //
  // @Post('generate')
  // @UseGuards(JwtAccessAuthGuard)
  // async register(@Res() res: Response, @Req() request: RequestWithUser) {
  //   const { otpAuthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);
  //
  //   return await this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpAuthUrl);
  // }
}