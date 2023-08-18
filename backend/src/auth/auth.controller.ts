import { Controller, Get, Post, Query, Res, Req, ConsoleLogger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Get('token')
    async getToken(@Req() request: Request, @Query('code') code: string, @Res({passthrough: true}) response: Response) {
        const result = await this.authService.getToken(code);
        response.cookie('oauth-token', result, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        // chceck if user already exists
        // TODO: getUserInfo MUST call OUR DATABASE to check if user exists
        const ftUser = await this.authService.getUserInfoFromFt(request);
        if (!ftUser) throw new Error('no ft user');
        const user = await this.authService.getUserInfoFromOurDB(ftUser.intraId);
        if (!user) return 'goto signup';
        return 'goto signin';
    }

    @Post('user-before-signup')
    async userBeforeSignUp(@Req() request: Request, @Res() response: Response) {
        const { intraId, intraNickname } = await this.authService.getUserInfoFromFt(request);
        //  check if user already exists
        //  if exist -> signin
        //  if not exist -> signup
        const user = await this.authService.findUser(intraId);
        if (!user) return response.status(200).send('goto signup');
        return response.status(200).send('goto signin');
    }

    @Post('signup')
    async signUp(@Req() request: Request, @Res() response: Response) {
        const userInfo = await this.authService.getUserInfoFromFt(request);
        if (!userInfo) return response.status(401).send('unauthorized');
        const { intraId, intraNickname } = userInfo;
        const { nickname, avatar, email } = request.body;
        const result = await this.authService.createUser(intraId, intraNickname, nickname, avatar, 0, email);
        if (!result) return response.status(500).send('signup failed');
        return response.status(200).send('signup success');
    }
}
