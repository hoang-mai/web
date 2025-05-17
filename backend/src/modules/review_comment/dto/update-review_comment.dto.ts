import { PartialType } from '@nestjs/swagger';
import { CreateReviewCommentDto } from './create-review_comment.dto';

export class UpdateReviewCommentDto extends PartialType(
  CreateReviewCommentDto,
) {}
