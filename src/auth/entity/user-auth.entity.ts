import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from '../../user/entity/user.entity';
import { MinLength } from 'class-validator';

@Entity()
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToOne(() => User, (user) => user.user_auth, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      if (this.password.length < 8) {
        throw new HttpException(
          'Password must be at least 8 charachters long',
          HttpStatus.BAD_REQUEST,
        );
      }
      try {
        this.password =
          this.password.length < 60
            ? await bcrypt.hash(this.password, 10)
            : this.password;
      } catch (error) {
        throw new InternalServerErrorException(
          'Bycript failed to create hash',
          error.message,
        );
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashRefreshTOken(): Promise<void> {
    if (this.refreshToken) {
      try {
        this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
      } catch (error) {
        throw new InternalServerErrorException(
          'Bycript failed to create hash',
          error.message,
        );
      }
    }
  }
}
