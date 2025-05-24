import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @ApiProperty({
    description: 'Tiêu đề bài viết',
    example: 'Hướng dẫn sử dụng NestJS',
  })
  title: string;

  @IsOptional()
  @ApiProperty({
    description: 'Mô tả bài viết',
    example: 'Một bài viết về NestJS',
  })
  description: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'isVisible phải là kiểu boolean' })
  @ApiProperty({
    description: 'Bài viết có hiển thị với người dùng không',
    example: true,
    default: true,
    required: false,
  })
  isVisible: boolean = true;

  @IsNotEmpty({ message: 'Ảnh không được để trống' })
  @ApiProperty({
    description: 'Đường dẫn ảnh bài viết',
    example: 'https://res.cloudinary.com/.../image.jpg',
  })
  imgUrl: string;
}
