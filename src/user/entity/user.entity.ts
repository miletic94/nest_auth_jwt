import { UserAuth } from 'src/auth/entity/user-auth.entity';
import { RefreshToken } from 'src/refresh-token/entity/refresh-token.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => UserAuth, (userAuth) => userAuth.user)
  user_auth: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refresh_token: RefreshToken;

  @CreateDateColumn({ type: 'timestamp' })
  created_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_date: Date;
}
