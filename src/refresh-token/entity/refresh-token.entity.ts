import { User } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @Column({ unique: true })
  device_id: string;

  @ManyToOne(() => User, (user) => user.refresh_token)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
