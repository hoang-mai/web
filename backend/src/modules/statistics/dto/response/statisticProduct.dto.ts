import { Expose } from 'class-transformer';
import { Category } from 'src/entities/category.enum';

export class StatisticProductDto {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  discount: number;
  category: Category;
  isDeleted: boolean;
  totalSold: number;
  totalRating: number;
  avgRating: number;
  totalReview: number;
  quantitySold: number;
  quantityDelivered: number;
  quantityPending: number;
  quantityCancelled: number;
  quantityReturned: number;
}
