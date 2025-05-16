import { BadRequestException, Injectable } from '@nestjs/common';

import { OrderItemsService } from '../order_item/order_item.service';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly orderItemsService: OrderItemsService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  statisticProduct(productId: number) {
    return this.productsService.statisticProductById(productId);
  }
  statisticRevenueProduct(productId: number, year?: number, month?: number) {
    this.productsService.checkProductExists(productId);
    return this.orderItemsService.statisticRevenueProduct(
      productId,
      year,
      month,
    );
  }

  statisticRevenue(year?: number, month?: number, week?: number) {
    return this.ordersService.statisticRevenue(year, month, week);
  }
}
