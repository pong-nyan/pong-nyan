import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

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
}