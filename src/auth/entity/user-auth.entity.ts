import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from "@nestjs/common";
import { User } from "../../user/entity/user.entity";

@Entity()
export class UserAuth extends BaseEntity  {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    password: string

    @Column({nullable: true})
    refreshToken: string

    @OneToOne(() => User, user => user.user_auth, {onDelete: 'CASCADE'})
    user: User

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = this.password.length < 60 ? await bcrypt.hash(this.password, 10) : this.password
            } catch(error) {
                throw new InternalServerErrorException("Bycript failed to create hash", error.message)
            }
        }
    }
}