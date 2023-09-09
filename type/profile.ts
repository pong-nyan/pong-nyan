import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Profile{
    @PrimaryGeneratedColumn()
    nickname: string;

    @Column()
    intraId: number;

    @Column()
    id : number;

    @Column()
    avatar: string;

    @Column()
    rankScore: number;

    // 42 intra id
    @Column()
    winner: number;

    // 42 intra id
    @Column()
    loser: number;

    // Game mode, 0: normal, 1: ranked
    @Column()
    gameMode: number;
}
