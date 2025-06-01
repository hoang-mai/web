import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @Type(() => Number)
  @IsNotEmpty({ message: 'Đánh giá không được để trống' })
  @IsInt({ message: 'Đánh giá phải là giá trị int' })
  @Min(1, { message: 'Số sao phải lớn hơn hoặc bằng 1' })
  @Max(5, { message: 'Số sao phải bé hơn hoặc bằng 5' })
  @ApiProperty({
    description: 'Đánh giá sao, số sao là một số nguyên từ 1 đến 5',
    example: '1',
  })
  rating: number;

  @IsNotEmpty({ message: 'Nội dung bình không được để trống' })
  @IsString({ message: 'Nội dung bình luận phải là một chuỗi ký tự' })
  @Length(1, 1000, { message: 'Bình luận phải từ 1 đến 1000 ký tự' })
  @ApiProperty({
    description: 'Nội dung bình luận/đánh giá',
    example: 'Sản phẩm này rất tốt',
  })
  review: string;

  @IsOptional()
  @IsString({ message: 'Link dẫn ảnh phải là một chuỗi ký tự' })
  @ApiProperty({
    description: 'Đường dẫn hình ảnh',
    example: 'https://res.cloudinary.com/.../image.jpg',
  })
  imageUrl?: string;

  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @ApiProperty({
    description: 'Tên sản phẩm đánh giá',
    example: 'Sản Phẩm A',
  })
  productName: string;
}
