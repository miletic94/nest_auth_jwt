import { UserAuth } from 'src/auth/entity/user-auth.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string 

    @Column({ unique: true})
    email: string

    @OneToOne(() => UserAuth, userAuth => userAuth.user)
    user_auth: string

    @CreateDateColumn({ type: 'timestamp'})
    created_date: Date 

    @UpdateDateColumn({ type: 'timestamp'})
    updated_date: Date
}