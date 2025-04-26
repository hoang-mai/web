import { BadRequestException, Injectable } from '@nestjs/common';

import { OrderItemsService } from '../order_item/order_item.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly orderItemsService: OrderItemsService,
    private readonly productsService: ProductsService,
  ) {}

  statisticProduct(productId: number) {
    return this.productsService.statisticProduct(productId);
  }
  statisticRevenueProduct(productId: number, year?: number, month?: number) {
    this.productsService.checkProductExists(productId);
    return this.orderItemsService.statisticRevenueProduct(productId, year, month);
  }
}
