import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { User } from './User';
import Friend from './Friend';

@Entity()
export default class FriendStatus {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => Friend, friend => friend.friendStatuses)
    friend : Friend;

    @Column({ default: 'pending' })
    status: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @ManyToOne(() => User)
    specificUser: User;

}