import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;

}
