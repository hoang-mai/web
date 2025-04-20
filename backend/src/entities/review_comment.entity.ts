import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Review } from './review.entity';
import { User } from './user.entity';

@Entity('review_comments')
export class ReviewComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'review_id' })
  @ManyToOne(() => Review, (review) => review.reviewComments, {
    onDelete: 'CASCADE',
  })
  review: Review;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.reviewComments)
  user: User;

  @Column()
  comment: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => ReviewComment, (reviewComment) => reviewComment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: ReviewComment;

  @OneToMany(() => ReviewComment, (reviewComment) => reviewComment.parent)
  replies: ReviewComment[];

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: false })
  reported: boolean;
}
