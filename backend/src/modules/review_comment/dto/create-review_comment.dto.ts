import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReviewCommentDto {
  @Type(() => Number)
  @IsInt({ message: 'Giá trị reviewId phải là int' })
  @IsNotEmpty({ message: 'Giá trị reviewId không được để trống' })
  reviewId: number;

  @IsString({ message: 'Nội dung bình luận phải là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  comment: string;

  @IsOptional()
  @IsString({ message: 'Đường dẫn hình ảnh phải là một chuỗi ký tự' })
  imageUrl?: string;

  @Type(() => Number)
  @IsInt({ message: 'Giá trị parentId phải là int' })
  parentId: number;
}
