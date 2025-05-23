import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from 'src/entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Order|null> {
    return this.ordersService.findOne(id);
  }

  @Post()
  async create(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.ordersService.create(orderData);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<Order>): Promise<Order|null> {
    return this.ordersService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.ordersService.delete(id);
  }
}
