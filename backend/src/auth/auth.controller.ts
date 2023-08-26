import { Controller, Get, Post, Query, Res, Req, ConsoleLogger, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {
    }

    @Get('token')
    async getToken(@Req() request: Request, @Query('code') code: string, @Res({passthrough: true}) response: Response) {
        const result = await this.authService.getToken(code);
        response.cookie('oauth-token', result, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        // chceck if user already exists
        // TODO: getUserInfo MUST call OUR DATABASE to check if user exists
        //  getUserInfoFromFt function change
        const ftUser = await this.authService.getUserInfoFromToken(result.access_token);
        if (!ftUser) throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
        const user = await this.authService.findUser(ftUser.intraId);
        if (!user) return 'goto signup';
        if (!user.google2faEnable) return 'goto qr';
        return 'goto signin';
    }

    @Post('signup')
    async signUp(@Req() request: Request, @Res() response: Response) {
        //  user exist check from my database
        const userInfo = await this.authService.getUserInfoFromCookie(request);
        if (!userInfo) return response.status(HttpStatus.UNAUTHORIZED).send('unauthorized');
        const { intraId, intraNickname } = userInfo;
        const { nickname, avatar, email } = request.body;
        const result = await this.authService.createUser(intraId, intraNickname, nickname, avatar, 0, email);
        if (!result) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('signup failed');
        return response.status(HttpStatus.CREATED).send('signup success');
    }
    @Get('signin')
    async signIn(@Req() request: Request, @Res() response: Response) {
        //  use JWT
        const userInfo = await this.authService.getUserInfoFromCookie(request);
        if (!userInfo) return response.status(HttpStatus.UNAUTHORIZED).send('unauthorized');

        const { intraId, intraNickname } = userInfo;
        const user = await this.authService.findUser(intraId);
        if (!user) return response.status(HttpStatus.NOT_FOUND).send('user not found');

        const jwt = await this.authService.createJwt(intraId, intraNickname, user.nickname);
        const decodedJwt = JSON.parse(JSON.stringify(this.jwtService.decode(jwt)));
        response.cookie('pn-jwt', jwt, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        return response.status(HttpStatus.ACCEPTED).send({ exp: decodedJwt.exp, nickname: decodedJwt.nickname });
    }

    @UseGuards(AuthGuard)
    @Get('mypage')
    async myPage(@Req() request: Request, @Res() response: Response) {
        console.log('mypage');
        // const userInfo = await this.authService.getUserInfoFromCookie(request);
        // if (!userInfo) return response.status(HttpStatus.UNAUTHORIZED).send('unauthorized');
        // const { intraId, intraNickname } = userInfo;
        // const user = await this.authService.findUser(intraId);
        // if (!user) return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send('signin failed');
        // return response.status(HttpStatus.OK).send(user);
        return response.status(HttpStatus.OK).send('mypage auth sucess');
    }
}
