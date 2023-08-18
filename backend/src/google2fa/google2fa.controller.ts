import { Controller } from '@nestjs/common';
import { Body, ClassSerializerInterceptor, Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { JwtAccessAuthGuard } from '../guard/jwt-access.guard';
import RequestWithUser from '../interfaces/requestWithUser.interface';

@Controller('google2fa')
export class Google2faController {
    constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAccessAuthGuard)
  async register(@Res() res: Response, @Req() request: RequestWithUser) {
    const { otpAuthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);

    return await this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpAuthUrl);
  }
}