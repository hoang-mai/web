import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Product, User])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
