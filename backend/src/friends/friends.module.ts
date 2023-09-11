import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import FriendStatus from 'src/entity/FriendStatus';
import Friend from 'src/entity/Friend';
import { User } from 'src/entity/User';
import { UserService } from 'src/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, FriendStatus, User])],
  controllers: [FriendsController],
  providers: [ FriendsService, UserService ]
})
export class FriendsModule {}
