import { PartialType } from '@nestjs/swagger';
import { CreateReviewCommentDto } from './create-review_comment.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateReviewCommentDto extends PartialType(
  CreateReviewCommentDto,
) {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsString()
  imageUrl: string;
}
