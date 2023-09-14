import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { GameInfo } from 'src/type/gameType';
import { User } from './User';
import { GameInfo } from 'src/type/gameType';

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

    @Column({ type: 'jsonb' })
    gameInfo: GameInfo;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}
