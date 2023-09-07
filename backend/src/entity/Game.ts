import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(() => User)
    winner: User;

    @ManyToOne(() => User)
    loser: User;

    // Game mode, 0: normal, 1: ranked
    @Column()
    gameMode: number;

    @Column()
    rankScore: number;

    @Column({ type: 'jsonb' })
    gameInfo: JSON;
}
