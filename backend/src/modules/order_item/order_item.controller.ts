import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrderItemsService } from './order_item.service';
import { OrderItem } from 'src/entities/order_item.entity';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  async getAll(): Promise<OrderItem[]> {
    return this.orderItemsService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }

  @Post()
  async create(@Body() orderItemData: Partial<OrderItem>): Promise<OrderItem> {
    return this.orderItemsService.create(orderItemData);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<OrderItem>): Promise<OrderItem> {
    return this.orderItemsService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.orderItemsService.delete(id);
  }
}
