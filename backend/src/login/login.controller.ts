import { Controller, Get, Query, Res} from '@nestjs/common';
import { LoginService } from './login.service';
import { Response } from 'express';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Get()
    getLogin(): string {
        console.log('LoginController.getLogin()');
        return this.loginService.getLogin();
    }

    // TODO: add type or interface for return value
    @Get('token')
    async getToken(@Query('code') code: string, @Res({passthrough: true}) response: Response) {
        const result = await this.loginService.getToken(code);
        response.cookie('oauth-token', result, {domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'none'});
        return 'test';
    }
}
