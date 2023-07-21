import { Controller, Get, Query } from '@nestjs/common';
import { LoginService } from './login.service';

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
    async getToken(@Query('code') code: string) {
        return await this.loginService.getToken(code);
    }
}
