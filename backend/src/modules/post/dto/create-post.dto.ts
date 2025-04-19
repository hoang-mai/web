import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
}
