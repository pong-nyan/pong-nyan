import { Controller, Get, Post, Query, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Get('token')
    async getToken(@Query('code') code: string, @Res({passthrough: true}) response: Response) {
        const result = await this.authService.getToken(code);
        response.cookie('oauth-token', result, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        return 'test';
    }

    @Post('user-before-signup')
    async userBeforeSignUp(@Req() request: Request, @Res() response: Response) {
        const { intraId, intraNickname } = await this.authService.getUserInfo(request);
        //  check if user already exists
        //  if exist -> signin
        //  if not exist -> signup
        const user = await this.authService.findUser(intraId);
        if (!user) return response.status(200).send('goto signup');
        return response.status(200).send('goto signin');
    }

    @Post('signup')
    async signUp(@Req() request: Request, @Res() response: Response) {
        console.log('WTF');
        const userInfo = await this.authService.getUserInfo(request);
        console.log('userInfo', userInfo);
        if (!userInfo) return response.status(401).send('unauthorized');
        const { intraId, intraNickname } = userInfo;
        const { nickname, avatar, email } = request.body;
        await this.authService.createUser(intraId, intraNickname, nickname, avatar, 0, email);
        return response.status(200).send('signup success');
    }
}
