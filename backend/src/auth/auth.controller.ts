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

    @Post('signup')
    async signUp(@Req() request: Request, @Res() response: Response) {
        //  get access token from cookie
        const oauthToken = request.cookies['oauth-token'];
        if (!oauthToken) return response.status(401).send('No token');
        const accessToken = JSON.parse(JSON.stringify(oauthToken)).access_token;

        //  get user info from 42 api
        const ftInfo = await this.authService.signUp(accessToken);
        const { id: intraId, login: intraNickname } = ftInfo.data;

        //  check if user already exists
        //  if exist -> signin
        //  if not exist -> signup
        const user = await this.authService.findUser(intraId);
        if (!user) return response.status(200).send('goto signup');
        return response.status(200).send('goto signin');
    }
}
