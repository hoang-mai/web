import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from 'src/entities/order_item.entity';
import e from 'express';
import { StatisticRevenueProductDto } from '../statistics/dto/response/statisticReveneProduct.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({ relations: ['order', 'product'] });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'product'],
    });

    if (!orderItem) {
      throw new NotFoundException(`OrderItem with id ${id} not found`);
    }

    return orderItem;
  }

  async create(orderItemData: Partial<OrderItem>): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create(orderItemData);
    return this.orderItemRepository.save(orderItem);
  }

  async update(id: number, updateData: Partial<OrderItem>): Promise<OrderItem> {
    const orderItem = await this.findOne(id); // will throw if not found

    Object.assign(orderItem, updateData);
    return this.orderItemRepository.save(orderItem);
  }

  async delete(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemRepository.remove(orderItem);
  }

  /**
   * Thống kê doanh thu sản phẩm
   * @param productId ID của sản phẩm
   * @param year Năm thống kê (nếu có)
   * @param month Tháng thống kê (nếu có)
   * @returns Doanh thu sản phẩm theo loại thống kê
   * @throws NotFoundException nếu không tìm thấy sản phẩm
   */
  async statisticRevenueProduct(
    productId: number,
    year?: number,
    month?: number,
  ): Promise<StatisticRevenueProductDto[]> {
    const qb = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select('SUM(orderItem.price * orderItem.quantity)', 'revenue')
      .where('orderItem.product_id = :productId', { productId });

    if (month && year) {
      qb.addSelect('FLOOR((DAY(orderItem.createdAt) - 1) / 7) + 1', 'week')
        .addSelect('MONTH(orderItem.createdAt)', 'month')
        .addSelect('YEAR(orderItem.createdAt)', 'year')
        .andWhere('MONTH(orderItem.createdAt) = :month', { month })
        .andWhere('YEAR(orderItem.createdAt) = :year', { year })
        .groupBy('week')
        .addGroupBy('MONTH(orderItem.createdAt)')
        .addGroupBy('YEAR(orderItem.createdAt)')
        .orderBy('week', 'ASC');
    } else if (year) {
      qb.addSelect('MONTH(orderItem.createdAt)', 'month')
        .addSelect('YEAR(orderItem.createdAt)', 'year')
        .andWhere('YEAR(orderItem.createdAt) = :year', { year })
        .groupBy('MONTH(orderItem.createdAt)')
        .addGroupBy('YEAR(orderItem.createdAt)')
        .orderBy('MONTH(orderItem.createdAt)', 'ASC');
    } else {
      qb.addSelect('YEAR(orderItem.createdAt)', 'year')
        .groupBy('YEAR(orderItem.createdAt)')
        .orderBy('YEAR(orderItem.createdAt)', 'ASC');
    }

    const data = await qb.getRawMany();

    return data;
  }

  
}
