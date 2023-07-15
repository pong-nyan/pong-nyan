import { Controller, Get } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    @Get()
    getLogin(): string {
        console.log('LoginController.getLogin()');
        return this.loginService.getLogin();
    }
}