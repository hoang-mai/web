import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'orderItems'] });
  }

  async findOne(id: number): Promise<Order|null> {
    return this.orderRepository.findOne({ where: { id }, relations: ['user', 'orderItems'] });
  }

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async update(id: number, updateData: Partial<Order>): Promise<Order|null> {
    await this.orderRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
