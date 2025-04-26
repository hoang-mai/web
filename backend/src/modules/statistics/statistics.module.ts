import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { OrderItemsModule } from '../order_item/order_item.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [OrderItemsModule, ProductsModule],
})
export class StatisticsModule {}
