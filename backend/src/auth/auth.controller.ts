import { Controller, Get, Post, Query, Res, Req, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RedirectDto, DefaultDto, CodeDto, CookieValue, SignupDto } from './auth.dto';
import { UserService } from 'src/user.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService) {
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
    @ApiResponse({ status: HttpStatus.OK, type: RedirectDto, description: 'auth/signup, auth/signin, auth/qr 같은 리디렉션 경로를 반환한다.' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: DefaultDto, description: '인증되지 않은 유저'})
    async getToken(@Query() codeDto: CodeDto, @Res({passthrough: true}) response: Response): Promise<RedirectDto> {
        //  code 값은 42 oauth2 인증 후 받아온 값
        const result = await this.authService.getToken(codeDto.code);
        response.cookie('oauth-token', result, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        // chceck if user already exists
        const ftUser = await this.authService.getUserInfoFromToken(result.access_token);
        if (!ftUser) throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
        const user = await this.authService.findUser(ftUser.intraId);

        //  user 가 없으면 회원가입하러 signup 으로
        if (!user) return { redirectUrl: '/auth/signup' };
        //  2fa 가 등록되어 있지 않고 사용자가 2fa 를 활성화했으면  2fa 등록하러 qr 으로
        if (user.google2faOption && !user.google2faEnable) return { redirectUrl: '/auth/qr' };
        //  2fa 가 enable 되어있으면 signin 으로 이동
        return { redirectUrl: '/auth/signin' };
    }

    @Post('signup')
    @ApiOperation({ summary: 'signup', description: '회원가입을 진행한다.' })
    @ApiBody({ type: SignupDto })
    @ApiResponse({ status: HttpStatus.CREATED, type: DefaultDto, description: '회원가입 성공. qr 등록하러 이동'})
    async signUp(@CookieValue() accessToken: string, @Body() signupDto: SignupDto) {
        const userInfo = await this.authService.getUserInfoFromToken(accessToken);
        if (!userInfo) return new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
        const { intraId, intraNickname, defaultAvatar } = userInfo;
        const { email, nickname, avatar } = signupDto;
        const result = await this.authService.createUser(intraId, intraNickname, nickname, avatar || defaultAvatar, 0, email);
        if (!result) return new HttpException('Create User Faild', HttpStatus.INTERNAL_SERVER_ERROR);
        return { redirectUrl: '/auth/qr' };
    }
    @Get('signin')
    @ApiOperation({ summary: 'signin', description: '로그인을 진행한다.' })
    @ApiResponse({ status: HttpStatus.OK, type: RedirectDto, description: '로그인 성공. if (2fa option true) 2fa 인증하러 이동 else 로그인'})
    async signIn(@CookieValue() accessToken: string) {
        const userInfo = await this.authService.getUserInfoFromToken(accessToken);
        if (!userInfo) return new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
        const { intraId } = userInfo;
        const user = await this.authService.findUser(intraId);
        if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
        // 2차 인증 활성화한 유저는 2차인증후 로그인(pn-jwt)를 박아줌
        if (user.google2faOption && user.google2faEnable) return { redirectUrl: '/auth/google-2fa-verify' };
        if (user.google2faOption && !user.google2faEnable) return { redirectUrl: '/auth/qr' };
        // 2차 인증 비활성화한 유저는 바로 로그인(pn-jwt)를 박아줌
        return { redirectUrl: '/auth/no-2fa-signin' };
    }


    @Post('no2fa-signin')
    async no2faSignIn(@Res() response: Response, @CookieValue() accessToken: string) {
        const userInfo = await this.authService.getUserInfoFromToken(accessToken);
        if (!userInfo) return new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
        const { intraId } = userInfo;
        const user = await this.authService.findUser(intraId);
        if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
        const jwt = await this.authService.createJwt(intraId, user.intraNickname, user.nickname);
        const decodedJwt = JSON.parse(JSON.stringify(this.jwtService.decode(jwt)));
        response.cookie('pn-jwt', jwt, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        this.userService.setUserMap(intraId, { client: { game: undefined, chat: undefined}, nickname: user.nickname, chatRoomList: [], gameRoom: '', online: false});
        return response.status(HttpStatus.ACCEPTED).send({ exp: decodedJwt.exp, nickname: decodedJwt.nickname, intraId: decodedJwt.intraId });
    }

    // backdoor for testing
    @ApiOperation({ summary: 'backdoor', description: '테스트용 mock user를 create, backdoor' })
    @ApiTags('backdoor')
    @Get('backdoor')
    async backdoor(@Req() request: Request, @Res() response: Response) {
        console.log('backdoor');
        for (let i = 0; i < 10; i++) {
            const randomIntraId = Math.floor(Math.random() * 100000);
            const randomIntraNickname = Math.floor(Math.random() * 100000).toString() + 'intra_nickname';
            const randomNickname = Math.floor(Math.random() * 1000000).toString() + 'nickname';
            const randomAvatar = Math.floor(Math.random() * 1000000).toString() + 'avatar';
            const randomEmail = Math.floor(Math.random() * 10000).toString() + '@gmail.com';
            await this.authService.createUser(randomIntraId, randomIntraNickname, randomNickname, randomAvatar, 0, randomEmail);
        }
        return response.status(HttpStatus.OK).send('42 mock user created sucess');
    }
}
