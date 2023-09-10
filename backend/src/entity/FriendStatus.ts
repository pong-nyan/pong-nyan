import { Column, CreateDateColumn, ManyToOne, } from 'typeorm';
import { User } from './User';
import Friend from './Friend';


export default class FriendStatus {
    @ManyToOne(() => Friend)
    id : number;

    @Column()
    status: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @ManyToOne(() => User)
    specificUser: User;

}