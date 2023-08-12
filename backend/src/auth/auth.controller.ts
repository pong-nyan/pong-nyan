import { Controller, Get, Post, Query, Res, Headers} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('token')
    async getToken(@Query('code') code: string, @Res({passthrough: true}) response: Response) {
        const result = await this.authService.getToken(code);
        response.cookie('oauth-token', result, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        return 'test';
    }

    @Post('sign-up')
    async signUp(@Headers('oauth-token') oauthToken: string | undefined,
                 @Res({passthrough: true}) response: Response) {
      if (!oauthToken)
        return response.status();
    }
}
