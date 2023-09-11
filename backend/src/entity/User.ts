import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable, DeleteDateColumn, Generated } from 'typeorm';
import { Game } from './Game';
import Friend from './Friend';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column( { unique: true })
    intraId: number;

    @Column({ unique: true })
    intraNickname: string;

    @Column({ unique: true })
    nickname : string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ nullable: true })
    rankScore: number;

    @Column({ nullable: true })
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

    @DeleteDateColumn({ type: 'timestamp', nullable: true })

    @OneToMany(() => Friend, friend => friend.requestUser)
    requestFriends: Friend[];

    @OneToMany(() => Friend, friend => friend.addressUser)
    addressFriends: Friend[]; deletedAt: Date;
}
