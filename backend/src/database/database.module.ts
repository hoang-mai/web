import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeederService } from './database-seeder.service';
import { DatabaseSeederCommand } from './database-seeder.command';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Cart } from '../entities/cart.entity';
import { CartProduct } from '../entities/cart_product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_item.entity';
import { Review } from '../entities/review.entity';
import { ReviewComment } from '../entities/review_comment.entity';
import { Post } from '../entities/post.entity';
import { SearchHistory } from '../entities/search_history.entity';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      Cart,
      CartProduct,
      Order,
      OrderItem,
      Review,
      ReviewComment,
      Post,
      SearchHistory,
      Chat,
      Message,
    ]),
  ],
  providers: [DatabaseSeederService, DatabaseSeederCommand],
  exports: [DatabaseSeederService],
})
export class DatabaseModule {}
