import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import FriendStatus from './FriendStatus';

@Entity()
export default class Friend {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => User, user => user.requestFriends)
    requestUser: User;

    @ManyToOne(() => User, user => user.addressFriends)
    addressUser: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @OneToMany(() => FriendStatus, friendStatus => friendStatus.friend)
    friendStatuses: FriendStatus[];
}