import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    winner: string;

    @Column()
    loser: string;

    // Game mode, 0: normal, 1: ranked
    @Column()
    gameMode: number;

    @Column()
    rankScore: number;

    @Column({ type: 'jsonb' })
    gameInfo: JSON;
}
