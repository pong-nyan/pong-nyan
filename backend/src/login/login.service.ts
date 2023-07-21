import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';



@Injectable()
export class LoginService {
    getLogin(): string {
        return 'Login';
    }
    async getToken(code: string) {
        //  post request oauth2 token
        const ret = await axios.post('https://api.intra.42.fr/oauth/token', 
            { 
                client_id: process.env.CLIENT_ID, 
                client_secret: process.env.CLIENT_SECRET, 
                code: code, grant_type: 'authorization_code', 
                redirect_uri: 'http://localhost:3000/login/callback'
            });
        return ret.data;
    }
}
