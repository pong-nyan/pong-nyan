import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id : number;

    // 42 intra id
    @Column()
    winner: number;

    // 42 intra id
    @Column()
    loser: number;

    // Game mode, 0: normal, 1: ranked
    @Column()
    gameMode: number;

    @Column()
    rankScore: number;

    @Column({ type: 'jsonb' })
    gameInfo: JSON;
}
