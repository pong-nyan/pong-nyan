import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import FriendStatus from 'src/entity/FriendStatus';
import Friend from 'src/entity/Friend';
import { User } from 'src/entity/User';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserModule } from 'src/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, FriendStatus, User]), UserModule],
  controllers: [FriendsController],
  providers: [ FriendsService, AuthGuard ]
})
export class FriendsModule {}
