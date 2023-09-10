import { CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';


export default class Friend {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => User)
    requestUser: User;

    @ManyToOne(() => User)
    addressUser: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}