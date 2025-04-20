import { ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
import { CreateReviewCommentDto } from './dto/create-review_comment.dto';
import { UpdateReviewCommentDto } from './dto/update-review_comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ReviewComment } from 'src/entities/review_comment.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
export class ReviewCommentService {
  constructor(
    @InjectRepository(ReviewComment)
    private readonly commentRepo: Repository<ReviewComment>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createComment(
    userId: number,
    createReviewCommentDto: CreateReviewCommentDto,
  ) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    const review = await this.reviewRepo.findOneByOrFail({
      id: createReviewCommentDto.reviewId,
    });

    const parent = createReviewCommentDto.parentId
      ? await this.commentRepo.findOneBy({
          id: createReviewCommentDto.parentId,
        })
      : undefined;

    const comment = this.commentRepo.create({
      comment: createReviewCommentDto.comment,
      imageUrl: createReviewCommentDto.imageUrl,
      user,
      review,
      ...(parent && { parent }),
    });

    return this.commentRepo.save(comment);
  }

  async likeComment(id: number) {
    const comment = await this.commentRepo.findOneByOrFail({ id });
    comment.likeCount += 1;
    return this.commentRepo.save(comment);
  }

  async reportComment(id: number) {
    const comment = await this.commentRepo.findOneByOrFail({ id });
    comment.reported = true;
    return this.commentRepo.save(comment);
  }

  async editComment(
    id: number,
    userId: number,
    updateReviewCommentDto: UpdateReviewCommentDto,
  ) {
    const comment = await this.commentRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!comment)
      throw new ForbiddenException('Bạn không thể sửa bình luận này.');

    comment.comment = updateReviewCommentDto.comment;
    comment.imageUrl = updateReviewCommentDto.imageUrl;
    return this.commentRepo.save(comment);
  }

  async deleteComment(id: number, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!comment)
      throw new ForbiddenException('Bạn không thể xoá bình luận này.');

    return this.commentRepo.delete(id);
  }

  async getCommentsByReview(reviewId: number) {
    return this.commentRepo.find({
      where: { review: { id: reviewId }, parent: IsNull() },
      relations: ['user', 'replies'],
      order: { createdAt: 'DESC' },
    });
  }
}
