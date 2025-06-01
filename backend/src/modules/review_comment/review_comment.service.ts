import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { CreateReviewCommentDto } from './dto/create-review_comment.dto';
import { UpdateReviewCommentDto } from './dto/update-review_comment.dto';

import { ReviewComment } from 'src/entities/review_comment.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.enum';

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

  async createComment(userId: number, dto: CreateReviewCommentDto) {
    const user = await this.userRepo.findOneByOrFail({ id: userId });
    const review = await this.reviewRepo.findOneByOrFail({ id: dto.reviewId });

    const parent = dto.parentId
      ? await this.commentRepo.findOneBy({ id: dto.parentId })
      : undefined;

    const comment = this.commentRepo.create({
      comment: dto.comment,
      imageUrl: dto.imageUrl,
      user,
      review,
      ...(parent && { parent }),
    });

    return this.commentRepo.save(comment);
  }

  private buildCommentTree(comments: any[]): any[] {
    const map = new Map<number, any>();
    const roots: any[] = [];

    comments.forEach((comment) => {
      map.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      const parentId = comment.parent?.id || comment.parentId;
      if (parentId && map.has(parentId)) {
        map.get(parentId).replies.push(map.get(comment.id));
      } else {
        roots.push(map.get(comment.id));
      }
    });

    return roots;
  }

  async getCommentsByReview(reviewId: number) {
    const comments = await this.commentRepo.find({
      where: { review: { id: reviewId }, parent: IsNull() },
      relations: ['user', 'replies', 'parent'],
      order: { createdAt: 'DESC' },
    });
    return this.buildCommentTree(comments);
  }

  async editComment(id: number, userId: number, dto: UpdateReviewCommentDto) {
    const comment = await this.commentRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'review', 'replies'],
    });

    if (!comment) throw new NotFoundException('Bình luận không tồn tại');
    if (comment.user.id !== userId)
      throw new ForbiddenException('Bạn không thể sửa bình luận này.');

    Object.assign(comment, dto);
    return this.commentRepo.save(comment);
  }

  async deleteComment(id: number, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    const userReq = await this.userRepo.findOne({ where: { id: userId } });

    if (!comment) throw new NotFoundException('Bình luận không tồn tại');
    if (!userReq) throw new NotFoundException('Người dùng không tồn tại');

    const isOwner = comment.user.id === userId;
    const isAdmin = userReq.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Bạn không có quyền xoá bình luận này');
    }

    return this.commentRepo.delete(id);
  }
}
