import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { JwtModule } from '@nestjs/jwt';
import { Google2faController } from './google2fa.controller';
import { Google2faService } from './google2fa.service';
import { Google2faGateway } from './google2fa.gateway';
import { UserModule } from '../user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ User ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d'}
    }),
    UserModule],
  controllers: [AuthController, Google2faController],
  providers: [AuthService, Google2faService, Google2faGateway],
})
export class AuthModule {}
