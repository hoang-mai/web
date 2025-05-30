import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('notification_tokens')
export class NotificationToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.notificationToken)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 2048 })
  endpoint: string;

  @Column({ type: 'text', nullable: true })
  p256dh: string;

  @Column({ type: 'text', nullable: true })
  auth: string;
}
