import { Injectable } from '@nestjs/common';
import axios, { type AxiosStatic } from 'axios';


@Injectable()
export class LoginService {
    getLogin(): string {
        return 'Login';
    }
    async getToken(code: string): Promise<AxiosStatic> {
        //  post request oauth2 token
        const formData = new FormData();
        formData.append('grant_type', 'authorization_code')
        formData.append('client_id', process.env.CLIENT_ID)
        formData.append('client_secret', process.env.CLIENT_SECRET)
        formData.append('code', code)
        formData.append('redirect_uri', process.env.REDIRECT_URI)
        return await axios.post('https://api.intra.42.fr/oauth/token', formData);
    }
}
