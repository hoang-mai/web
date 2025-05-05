import { Expose } from 'class-transformer';
import { Category } from 'src/entities/category.enum';

export class StatisticProductDto {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;

  @Expose({ name: 'image_url' })
  imageUrl: string;
  discount: number;
  category: Category;
  totalSold: number;
  totalRating: number;
  avgRating: number;
  totalReview: number;
  quantitySold: number;
}
