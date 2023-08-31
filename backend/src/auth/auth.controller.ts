import { Controller, Get, Post, Query, Res, Req, ConsoleLogger, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {
    }

    /**
     * 
     * @param request 
     * @param code "42 oauth2 인증 후 받아온 값"
     * @param response 
     * @returns 
     */
    @Get('token')
    @ApiOperation({ summary: 'get access token from code and redirect', description: 'intra 에서 받아온 code 값으로 access token 을 발급한다. signup, signin, qr 로 redirect 한다.' })
    @ApiResponse({ status: 302, description: 'redirect to signup or signin or qr'})
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'unauthorized'})
    async getToken(@Req() request: Request, @Query('code') code: string, @Res({passthrough: true}) response: Response) {
        //  code 값은 42 oauth2 인증 후 받아온 값
        const result = await this.authService.getToken(code);
        response.cookie('oauth-token', result, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        // chceck if user already exists
        // TODO: getUserInfo MUST call OUR DATABASE to check if user exists
        //  getUserInfoFromFt function change
        const ftUser = await this.authService.getUserInfoFromToken(result.access_token);
        if (!ftUser) throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
        const user = await this.authService.findUser(ftUser.intraId);
        if (!user) return response.redirect('https://localhost/auth/signup');
        if (!user.google2faEnable) return response.redirect('https://localhost/auth/qr');
        return response.redirect('https://localhost/auth/signin');
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
        const userInfo = await this.authService.getUserInfoFromCookie(request);
        if (!userInfo) return response.status(HttpStatus.UNAUTHORIZED).send('unauthorized');
        const { intraId } = userInfo;
        const user = await this.authService.findUser(intraId);
        if (!user) return response.status(HttpStatus.NOT_FOUND).send('user not found');

        return response.status(HttpStatus.ACCEPTED).send('goto 2fa');
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
