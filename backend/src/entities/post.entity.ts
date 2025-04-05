import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @Column()
  title: string;

  @IsOptional()
  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
