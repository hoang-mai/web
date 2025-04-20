import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReviewCommentDto {
  @IsInt()
  reviewId: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  parentId: number;
}
