import { Controller, Get, Query } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Get()
    getLogin(): string {
        console.log('LoginController.getLogin()');
        return this.loginService.getLogin();
    }

    // TODO: add type or interface for return value
    @Get('token')
    getToken(@Query('code') code: string): object {
        console.log('LoginController.getToken()');
        console.log('code', code);
        return this.loginService.getToken();
    }
}