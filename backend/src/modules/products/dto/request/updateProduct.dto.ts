import { Type } from 'class-transformer';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Category } from 'src/entities/category.enum';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Tên sản phẩm phải là một chuỗi' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Giá sản phẩm phải là số' })
  @Min(0, { message: 'Giá sản phẩm phải lớn hơn hoặc bằng 0' })
  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Số lượng sản phẩm phải là số' })
  @Min(0, { message: 'Số lượng sản phẩm phải lớn hơn hoặc bằng 0' })
  @IsNotEmpty({ message: 'Số lượng sản phẩm không được để trống' })
  stock?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  imageUrl?: string;

  @IsOptional()
  category?: Category;

  @IsOptional()
  @IsNumber({}, { message: 'Giảm giá sản phẩm phải là số' })
  @Min(0, { message: 'Giảm giá sản phẩm phải lớn hơn hoặc bằng 0' })
  @Max(100, { message: 'Giảm giá sản phẩm không được lớn hơn 100' })
  discount?: number;
}
