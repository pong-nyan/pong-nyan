import { Controller, Get, Post, Query, Res, Req, ConsoleLogger, HttpException } from '@nestjs/common';
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
        //  getUserInfoFromFt function change
        const ftUser = await this.authService.getUserInfoFromToken(result.access_token);
        if (!ftUser) throw new HttpException('unauthorized', 401);
        const user = await this.authService.findUser(ftUser.intraId);
        if (!user) return 'goto signup';
        return 'goto signin';
    }

    @Post('signup')
    async signUp(@Req() request: Request, @Res() response: Response) {
        //  user exist check from my database
        const userInfo = await this.authService.getUserInfoFromCookie(request);
        if (!userInfo) return response.status(401).send('unauthorized');
        const { intraId, intraNickname } = userInfo;
        const { nickname, avatar, email } = request.body;
        const result = await this.authService.createUser(intraId, intraNickname, nickname, avatar, 0, email);
        if (!result) return response.status(500).send('signup failed');
        return response.status(200).send('signup success');
    }
    @GET('signin')
    async signIn(@Req() request: Request, @Res() response: Response) {
        //  use JWT

    }
}
