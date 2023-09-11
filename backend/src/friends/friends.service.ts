import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Friend from 'src/entity/Friend';
import FriendStatus from 'src/entity/FriendStatus';
import { User } from 'src/entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(FriendStatus)
        private readonly friendStatusRepository: Repository<FriendStatus>,
    ) {}

    async getFriends(intraId: number): Promise<Friend[]> {
        const user = await this.userRepository.findOne({ where: { intraId }, relations: ['requestFriends', 'addressFriends'] });
        return [...user.requestFriends, ...user.addressFriends];
    }

    async addFriend(intraId: number, friendId: number): Promise<Friend> {
        const user = await this.userRepository.findOne({ where: { intraId } });
        const friend = await this.userRepository.findOne({ where: { intraId: friendId } });
        const newFriend = await this.friendRepository.create({ requestUser: user, addressUser: friend });
        await this.friendRepository.save(newFriend);
        const newFriendStatus = this.friendStatusRepository.create({ friend: newFriend, status: 0, specificUser: user });
        await this.friendStatusRepository.save(newFriendStatus);
        return newFriend;
    }
}

