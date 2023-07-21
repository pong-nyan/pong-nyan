import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
    getLogin(): string {
        return 'Login';
    }
    getToken(): object {
        return {};
    }
}
