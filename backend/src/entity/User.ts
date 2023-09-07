import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Game } from './Game';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    intraId: number;

    @Column()
    intraNickname: string;

    @Column()
    nickname : string;

    @Column()
    avatar: string;

    @Column()
    rankScore: number;

    @Column()
    email: string;

    @Column({ nullable: true })
    google2faSecret: string;

    @Column({ default: false })
    google2faEnable: boolean;

    @OneToMany(() => Game, game => game.winner)
    winnerGames: Game[];

    @OneToMany(() => Game, game => game.loser)
    loserGames: Game[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;

}
