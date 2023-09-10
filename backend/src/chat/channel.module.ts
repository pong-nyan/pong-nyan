import { Module } from '@nestjs/common';
import { ChannelGateway } from './channel.gateway';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/User';
import { UserModule } from 'src/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d'}
    }),
    UserModule],
  providers: [ChannelGateway, ChannelService],
  controllers: [ChannelController]
})
export class ChannelModule {}
