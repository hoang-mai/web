import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { ProductsModule } from '../products/products.module';
import { ReviewAdminController } from './review_admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product, User]), ProductsModule],
  controllers: [ReviewController, ReviewAdminController],
  providers: [ReviewService],
})
export class ReviewModule {}
