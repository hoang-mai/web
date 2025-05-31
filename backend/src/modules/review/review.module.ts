import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { ProductsModule } from '../products/products.module';
import { ReviewAdminController } from './review_admin.controller';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order_item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product, User, Order, OrderItem]),
    ProductsModule,
  ],
  controllers: [ReviewController, ReviewAdminController],
  providers: [ReviewService],
})
export class ReviewModule {}
