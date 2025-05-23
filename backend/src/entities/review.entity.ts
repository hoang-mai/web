import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { User } from './user.entity';
import { ReviewComment } from './review_comment.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  review: string;

  @Column({ nullable: true })
  imageUrl: string;

  @JoinColumn({ name: 'product_id' })
  @ManyToOne(() => Product, (product) => product.reviews, { nullable: false })
  product: Product;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.reviews, { nullable: false })
  user: User;

  @OneToMany(() => ReviewComment, (reviewComment) => reviewComment.review)
  reviewComments: ReviewComment[];

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: false })
  reported: boolean;
}
