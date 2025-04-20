import { Module } from '@nestjs/common';
import { ReviewCommentService } from './review_comment.service';
import { ReviewCommentController } from './review_comment.controller';
import { ReviewComment } from 'src/entities/review_comment.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewComment, Review, User])],
  controllers: [ReviewCommentController],
  providers: [ReviewCommentService],
})
export class ReviewCommentModule {}
