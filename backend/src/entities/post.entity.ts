import { IsNotEmpty, IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @Column()
  title: string;

  @IsOptional()
  @Column('text')
  description: string;

  @IsNotEmpty({ message: 'Ảnh không được để trống' })
  @Column()
  imgUrl: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;
}
