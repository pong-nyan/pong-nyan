import { Body, ClassSerializerInterceptor, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Google2faService } from './google2fa.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CookieValue } from './auth.dto';
import { UserService } from 'src/user.service';

@Controller('google2fa')
export class Google2faController {
    constructor(
    private readonly google2faService: Google2faService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @Get('qr')
  //  TODO: Add AuthGuard
  async register(@Res() response: Response, @CookieValue() accessToken: string) {
    //  cookie 로 부터 user 정보를 가져옴
    console.log('accessToken', accessToken);
    const { intraId } = await this.authService.getUserInfoFromToken(accessToken);
    const user = await this.authService.findUser(intraId);
    const { otpAuthUrl } = await this.google2faService.generateTwoFactorAuthenticationSecret(user);

    return await this.google2faService.pipeQrCodeStream(response, otpAuthUrl);
  }

  @Post('enable')
  async enable(@Res() response: Response, @CookieValue() accessToken: string, @Body() body: { code: string }) {
    console.log('enable code ', body.code);

    const { intraId } = await this.authService.getUserInfoFromToken(accessToken);
    const user = await this.authService.findUser(intraId);
    const isCodeValid = await this.google2faService.isTwoFactorAuthenticationCodeValid(body.code, user);

    if (isCodeValid) {
      // TODO : 2번째인자 3번째인자확인
      const jwt = await this.authService.createJwt(intraId, user.intraNickname, user.nickname);
      const decodedJwt = JSON.parse(JSON.stringify(this.jwtService.decode(jwt)));
      await this.authService.enableTwoFactorAuthentication(user);
      response.cookie('pn-jwt', jwt, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});

      this.userService.setUserMap(intraId, { nickname: user.nickname, chatRoomList: [], gameRoom: ''});

      return response.status(HttpStatus.ACCEPTED).send({ exp: decodedJwt.exp, nickname: decodedJwt.nickname, intraId: decodedJwt.intraId });
    }
    return response.status(HttpStatus.UNAUTHORIZED).send('failed');
  }
}
