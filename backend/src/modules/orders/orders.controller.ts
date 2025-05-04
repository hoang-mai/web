import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query 
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto } from './dtos/createOrder.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('filter')
  async filterOrders(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('status') status: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ): Promise<Order[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.ordersService.findOrders(userId, status, startDate, endDate);
  }
  @Get('all/:userId')
  async findAllByUserId(@Param('userId') userId: number): Promise<Order[]> {
    return this.ordersService.findAllByUserId(userId);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Order | null> {
    return this.ordersService.findOne(id);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }
  @Patch('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Order>, // Nên dùng DTO nếu muốn kiểm soát field
  ): Promise<Order | null> {
    return this.ordersService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.delete(id);
  }
  @Get()
  async getAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

}
