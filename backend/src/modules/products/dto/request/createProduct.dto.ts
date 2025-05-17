import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsEnum,
  Max,
} from 'class-validator';
import { Category } from 'src/entities/category.enum';

export class CreateProductDto {
  @IsString({ message: 'Tên sản phẩm phải là một chuỗi' })
  @IsNotEmpty({ message: 'Bắt buộc cần có tên sản phẩm' })
  name: string;

  @IsNumber({}, { message: 'Giá sản phẩm phải là một số' })
  @IsNotEmpty({ message: 'Bắt buộc cần có giá tiền' })
  @Min(0, { message: 'Giá sản phẩm phải lớn hơn hoặc bằng 0' })
  price: number;

  @IsNumber({}, { message: 'Số lượng sản phẩm phải là một số' })
  @IsOptional({ message: 'Số lượng sản phẩm không bắt buộc' })
  @Min(0, { message: 'Số lượng sản phẩm phải lớn hơn hoặc bằng 0' })
  stock?: number;

  @IsString({ message: 'Danh mục sản phẩm phải là một chuỗi' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Đường dẫn ảnh sản phẩm phải là một chuỗi' })
  @IsNotEmpty({ message: 'Bắt buộc cần có đường dẫn ảnh sản phẩm' })
  imageUrl: string;

  @IsEnum(Category, { message: 'Danh mục sản phẩm không hợp lệ' })
  category: Category;

  @IsOptional()
  @IsNumber({}, { message: 'Giảm giá sản phẩm phải là số' })
  @Min(0, { message: 'Giảm giá sản phẩm phải lớn hơn hoặc bằng 0' })
  @Max(100, { message: 'Giảm giá sản phẩm không được lớn hơn 100' })
  discount?: number;
}
