import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
    async getToken(code: string) {
        //  post request oauth2 token
        const ret = await axios.post('https://api.intra.42.fr/oauth/token',
            {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.REDIRECT_URI
            });
        return ret.data;
    }
}
