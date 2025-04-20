import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  review: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  productId: number;
}
