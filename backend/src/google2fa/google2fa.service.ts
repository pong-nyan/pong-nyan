import { Injectable } from '@nestjs/common';
import { User } from '../entity/User';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class Google2faService {
    async generateTwoFactorAuthenticationSecret(nickname: string) {

    // otplib를 설치한 후, 해당 라이브러리를 통해 시크릿 키 생성
    const secret = authenticator.generateSecret();

    // accountName + issuer + secret 을 활용하여 인증 코드 갱신을 위한 인증 앱 주소 설정
    const otpAuthUrl = authenticator.keyuri(nickname, process.env.APP_NAME, secret);
    // User 테이블 내부에 시크릿 키 저장 (UserService에 작성)


    // 생성 객체 리턴

    // qrcode의 toFileStream()을 사용해 QR 이미지를 클라이언트에게 응답
    // 이때, Express의 Response 객체를 받아옴으로써 클라이언트에게 응답할 수 있다.
    }
}
