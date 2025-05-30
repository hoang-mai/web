import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity('chats')
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;

  @ManyToOne(() => User, (user) => user.chats)
  admin: User;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @Column({ default: false })
  isUserDeleted: boolean;

  @Column({ default: false })
  isAdminDeleted: boolean;
}
