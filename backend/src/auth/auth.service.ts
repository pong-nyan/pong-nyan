import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { User } from '../entity/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
                private readonly jwtService: JwtService
    ) { }
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
    async getFtUserInfo(accessToken: string) {
        //  get request user info
        const ret = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return ret;
    }

    // get access token from cookie
    async getUserInfoFromToken(accessToken: string) {
        //  get user info from 42 api
        const ftUserInfo = await this.getFtUserInfo(accessToken);
        const { id: intraId, login: intraNickname } = ftUserInfo.data;
        return { intraId, intraNickname };
    }

    async getUserInfoFromOurDB(intraId: number) {
        if (!intraId) return null;
        return await this.userRepository.findOne({ where: { intraId: intraId } });
    }

    async findUser(intraId: number) {
        if (!intraId) return null;
        return await this.userRepository.findOne({ where: { intraId: intraId } });
    }

    async isUserRegisterdQR(intraId: number) {
        if (!intraId) return false;
        const user = await this.userRepository.findOne({ where: { intraId: intraId } });
        if (!user) return false;
        return user.google2faEnable;
    }
    /**
     * @warning this function also updates user info
     * @warning should be called after check if user exists
    */
    async createUser(intraId: number, intraNickname: string, nickname: string, avatar: string, rankScore: number, email: string) {
        const user = new User();
        user.intraId = intraId;
        user.intraNickname = intraNickname;
        user.nickname = nickname;
        user.avatar = avatar;
        user.rankScore = rankScore;
        user.email = email;
        const existUser = this.userRepository.findOne({ where: { intraId: intraId } });
        if (!existUser) return await this.userRepository.update({ intraId: intraId }, user);
        else return await this.userRepository.save(user);
    }

    async createJwt(intraId: number, intraNickname: string, nickname: string) {
        const payload = {intraId, intraNickname, nickname};
        return await this.jwtService.signAsync(payload);
    }

    async updateUser2faSecret(intraId: number, secret: string) {
        return await this.userRepository.update({intraId: intraId}, {google2faSecret: secret});
    }

    async updateUser2faEnable(intraId: number, enable: boolean) {
        return this.userRepository.update({intraId: intraId}, {google2faEnable: enable});
    }

    async enableTwoFactorAuthentication(user: User) {
        await this.updateUser2faEnable(user.intraId, true);
    }
}
