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
        const user = await this.userRepository.findOne({ where: { intraId } });
        const friends = await this.friendRepository
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.requestUser', 'requestUser')
        .leftJoinAndSelect('friend.addressUser', 'addressUser')
        .leftJoinAndSelect('friend.friendStatuses', 'friendStatuses')
        .leftJoinAndSelect(subQuery => {
            return subQuery
            .select('fs1.*')
            .from(FriendStatus, 'fs1')
            .leftJoin(FriendStatus, 'fs2', 'fs1.friendId = fs2.friendId AND fs1.createdAt < fs2.createdAt')
            .where('fs2.createdAt IS NULL');
        }, 'fs', 'fs."friendId" = friend.id')
        .where('requestUser.id = :userId OR addressUser.id = :userId', { userId: user.id })
        .getMany();

        // friends 의 friendStatuses 를 friendStatus 의 createdAt 이 마지막인 것만 남긴다.
        const refineFriends = friends.map(friend => {
            const newFriend = friend;
            newFriend.friendStatuses = friend.friendStatuses.filter(friendStatus => {
                return friendStatus.createdAt === friend.friendStatuses.reduce((a, b) => {
                    return a.createdAt > b.createdAt ? a : b;
                }).createdAt;
            });
            return newFriend;
        });
        return refineFriends;
    }

    async getAcceptedFriends(intraId: number): Promise<Friend[]> {
        const user = await this.userRepository.findOne({ where: { intraId } });
        const friends = await this.friendRepository
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.requestUser', 'requestUser')
        .leftJoinAndSelect('friend.addressUser', 'addressUser')
        .leftJoinAndSelect('friend.friendStatuses', 'friendStatuses')
        .leftJoinAndSelect(subQuery => {
            return subQuery
            .select('fs1.*')
            .from(FriendStatus, 'fs1')
            .leftJoin(FriendStatus, 'fs2', 'fs1.friendId = fs2.friendId AND fs1.createdAt < fs2.createdAt')
            .where('fs2.createdAt IS NULL');
        }, 'fs', 'fs."friendId" = friend.id')
        .where('requestUser.id = :userId OR addressUser.id = :userId', { userId: user.id })
        .getMany();
                // friends 의 friendStatuses 를 friendStatus 의 createdAt 이 마지막인 것만 남긴다.
                // friends 중에서 마지막으로 남은 friendStatuses 가 accepted 인 것만 남긴다.
        const refineFriends = friends.filter(friend => {
            const newFriend = friend;
            newFriend.friendStatuses = friend.friendStatuses.filter(friendStatus => {
                return friendStatus.createdAt === friend.friendStatuses.reduce((a, b) => {
                    return a.createdAt > b.createdAt ? a : b;
                }).createdAt;
            });
            return newFriend.friendStatuses[0].status === 'accepted';
        });
        return refineFriends;
    }

    async getPendingFriends(intraId: number): Promise<Friend[]> {
        const user = await this.userRepository.findOne({ where: { intraId } });
        const friends = await this.friendRepository
        .createQueryBuilder('friend')
        .leftJoinAndSelect('friend.requestUser', 'requestUser')
        .leftJoinAndSelect('friend.addressUser', 'addressUser')
        .leftJoinAndSelect('friend.friendStatuses', 'friendStatuses')
        .leftJoinAndSelect(subQuery => {
            return subQuery
            .select('fs1.*')
            .from(FriendStatus, 'fs1')
            .leftJoin(FriendStatus, 'fs2', 'fs1.friendId = fs2.friendId AND fs1.createdAt < fs2.createdAt')
            .where('fs2.createdAt IS NULL');
        }, 'fs', 'fs."friendId" = friend.id')
        .where('addressUser.id = :userId', { userId: user.id })
        .getMany();

        // friends 의 friendStatuses 를 friendStatus 의 createdAt 이 마지막인 것만 남긴다.
        const refineFriends = friends.map(friend => {
            const newFriend = friend;
            newFriend.friendStatuses = friend.friendStatuses.filter(friendStatus => {
                return friendStatus.createdAt === friend.friendStatuses.reduce((a, b) => {
                    return a.createdAt > b.createdAt ? a : b;
                }).createdAt;
            });
            return newFriend;
        });
        // accepted 되거나 rejected된 친구들은 거르기
        const onlyPendingFriend = refineFriends.filter(friend => {
            return friend.friendStatuses[0].status === 'pending';
        });
        return onlyPendingFriend;
    }

    async addFriend(intraId: number, friendIntraId: number): Promise<Friend> {
        const user = await this.userRepository.findOne({ where: { intraId } });
        const friend = await this.userRepository.findOne({ where: { intraId: friendIntraId } });
        const newFriend = await this.friendRepository.create({ requestUser: user, addressUser: friend });
        await this.friendRepository.save(newFriend);
        const newFriendStatus = this.friendStatusRepository.create({ friend: newFriend, specificUser: user });
        await this.friendStatusRepository.save(newFriendStatus);
        return newFriend;
    }

    async addFriendByNickname(intraId: number, friendNickname: string): Promise<Friend> {
        const user = await this.userRepository.findOne({ where: { intraId } });
        const friend = await this.userRepository.findOne({ where: { nickname: friendNickname } });
        if (!friend) throw new Error('No friend found');
        if (!user) throw new Error('No User found');
        const newFriend = await this.friendRepository.create({ requestUser: user, addressUser: friend });
        await this.friendRepository.save(newFriend);
        const newFriendStatus = this.friendStatusRepository.create({ friend: newFriend, specificUser: user });
        await this.friendStatusRepository.save(newFriendStatus);
        return newFriend;
    }

    async updateFriendStatus(intraId: number, friend: Friend, status: string): Promise<FriendStatus> {
        const user = await this.userRepository.findOne({ where: { intraId } });
        const newFriendStatus = await this.friendStatusRepository.create({ friend, status, specificUser: user });
        return await this.friendStatusRepository.save(newFriendStatus);
    }

    async validateRequestFriend(intraId: number, friendId: number): Promise<Friend> {
        const friend = await this.friendRepository.findOne({ where: { id: friendId }, relations: ['requestUser'] });
        if (friend.requestUser.intraId !== intraId) throw new Error('No friend found');
        return friend;
    }

    async validateAcceptFriend(intraId: number, friendId: number): Promise<Friend> {
        const friend = await this.friendRepository.findOne({ where: { id: friendId }, relations: ['addressUser'] });
        if (!friend) throw new Error('No friend found');
        if (friend.addressUser.intraId !== intraId) throw new Error('No friend found');
        return friend;
    }
}

