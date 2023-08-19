import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Google2faController } from './google2fa.controller';
import { Google2faService } from './google2fa.service';

@Module({
  imports: [TypeOrmModule.forFeature([ User ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d'}
    })
  ],
  controllers: [AuthController, Google2faController],
  providers: [AuthService, JwtService, Google2faService]
})
export class AuthModule {}
