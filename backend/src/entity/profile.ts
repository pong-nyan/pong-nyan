import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    intraId: number;

    @Column()
    nickname: string ;

    //image url
    @Column()
    avatar: string ;

    @Column()
    rankScore: number;

    @Column()
    winner: number;

    @Column()
    loser: number;
}
