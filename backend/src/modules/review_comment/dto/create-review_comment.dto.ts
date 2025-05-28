import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReviewCommentDto {
  @IsInt()
  @IsNotEmpty()
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
