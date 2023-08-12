import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { User } from '../entity/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }
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
    async signUp(accessToken: string) {
        //  get request user info
        const ret = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return ret;
    }
    async findUser(intraId: number) {
        return await this.userRepository.findOne({ where: { intraId: intraId } });
    }
    async createUser(intraId: number, intraNickname: string, nickname: string, avatar: string, rankScore: number) {
        const user = new User();
        user.intraId = intraId;
        user.intraNickname = intraNickname;
        user.nickname = nickname;
        user.avatar = avatar;
        user.rankScore = rankScore;
        return await this.userRepository.save(user);
    }
}
