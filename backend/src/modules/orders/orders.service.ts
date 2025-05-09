import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order_item.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderStatus } from 'src/entities/order_status.enum';
import { StatisticRevenueDto } from '../statistics/dto/response/statisticRevenue.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  // ✅ CREATE
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const order = this.orderRepository.create({ user });
    await this.orderRepository.save(order);

    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findOne({ where: { id: item.productId, isDeleted: false } });
      if (!product)
        throw new NotFoundException(
          `Product with id ${item.productId} not found`,
        );
      if (product.stock < item.quantity)
        throw new BadRequestException(
          `Not enough stock for product ${product.name}`,
        );

      product.stock -= item.quantity;
      await this.productRepository.save(product);

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        order,
        price: product.price* item.quantity * product.discount ,
      });
      order.totalPrice += product.price * item.quantity * product.discount;
      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);
    order.orderItems = orderItems;
    return this.orderRepository.save(order);
  }

  // ✅ FIND ALL
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  // ✅ FIND ONE
  async findOne(id: number): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async update(id: number, updateData: Partial<Order>): Promise<string> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // ❌ Không cho phép cập nhật nếu đơn đã giao hoặc đã hủy
    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException(
        `Cannot update order with status: ${order.status}`,
      );
    }

    const allowedFields: (keyof Order)[] = ['status', 'totalPrice'];
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        (order as any)[key] = updateData[key];
      }
    }

    await this.orderRepository.save(order);
    return 'Order updated successfully';
  }

  // ✅ DELETE
  async delete(id: number): Promise<void> {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    // Optional: Restore stock if needed before deleting
    for (const item of order.orderItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.product.id },
      });
      if (product) {
        product.stock += item.quantity;
        await this.productRepository.save(product);
      }
    }
    await this.orderRepository.remove(order); // cascade deletes orderItems if set up
  }
  // ✅ FIND ALL BY USER ID
  async findAllByUserId(userId: number): Promise<Order[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOrders(
    userId: number,
    status: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Order[]> {
    const where: FindOptionsWhere<Order> = {
      user: { id: userId },
      createdAt: Between(startDate, endDate),
    };

    if (status.toLowerCase() !== 'all') {
      where.status = status as OrderStatus;
    }

    return this.orderRepository.find({
      where,
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }
  /**
   * Thống kê doanh thu tổng thể
   * @param year Năm thống kê (nếu có)
   * @param month Tháng thống kê (nếu có)
   * @param week Tuần thống kê (nếu có)
   * @returns Doanh thu tổng thể theo loại thống kê
   */
  async statisticRevenue(
    year?: number,
    month?: number,
    week?: number,
  ): Promise<StatisticRevenueDto> {
    if (week && (!month || !year)) {
      throw new BadRequestException('Tuần yêu cầu tháng và năm');
    }
    if (month && !year) {
      throw new BadRequestException('Tháng yêu cầu năm');
    }

    const qb = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'revenue')
      .addSelect(
        'SUM(CASE WHEN order.status = "delivered" THEN orderItem.quantity ELSE 0 END)',
        'quantityDelivered',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = "pending" THEN orderItem.quantity ELSE 0 END)',
        'quantityPending',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = "cancelled" THEN orderItem.quantity ELSE 0 END)',
        'quantityCancelled',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = "returned" THEN orderItem.quantity ELSE 0 END)',
        'quantityReturned',
      )
      .leftJoin('order.orderItems', 'orderItem')
      .where('1=1');

    if (year) {
      qb.andWhere('YEAR(order.createdAt) = :year', { year });
    }

    if (month) {
      qb.andWhere('MONTH(order.createdAt) = :month', { month });
    }

    if (week) {
      const weekExpr = 'FLOOR((DAY(order.createdAt) - 1) / 7) + 1';
      qb.andWhere(`${weekExpr} = :week`, { week });
    }

    const rawData = await qb.getRawOne();

    // Lấy sản phẩm bán chạy nhất
    const productQb = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select('product.name', 'name')
      .addSelect('SUM(orderItem.quantity)', 'total')
      .innerJoin('orderItem.product', 'product')
      .innerJoin('orderItem.order', 'order')
      .where('1=1')
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED });

    if (year) {
      productQb.andWhere('YEAR(orderItem.createdAt) = :year', { year });
    }
    if (month) {
      productQb.andWhere('MONTH(orderItem.createdAt) = :month', { month });
    }
    if (week) {
      productQb.andWhere('FLOOR((DAY(orderItem.createdAt)-1)/7)+1 = :week', {
        week,
      });
    }

    const topProducts = await productQb
      .groupBy('product.name')
      .orderBy('total', 'DESC')
      .limit(5)
      .getRawMany();

    const revenueQb = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'revenue')
      .addSelect(
        'SUM(CASE WHEN order.status = "delivered" THEN orderItem.quantity ELSE 0 END)',
        'quantityDelivered',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = "pending" THEN orderItem.quantity ELSE 0 END)',
        'quantityPending',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = "cancelled" THEN orderItem.quantity ELSE 0 END)',
        'quantityCancelled',
      )
      .addSelect(
        'SUM(CASE WHEN order.status = "returned" THEN orderItem.quantity ELSE 0 END)',
        'quantityReturned',
      )
      .leftJoin('order.orderItems', 'orderItem')
      .where('1=1');

    // === Thống kê theo năm (mặc định) ===
    if (!year && !month && !week) {
      revenueQb
        .addSelect('YEAR(order.createdAt)', 'year')
        .groupBy('YEAR(order.createdAt)')
        .orderBy('YEAR(order.createdAt)', 'ASC');
    }

    // === Thống kê theo tháng (nếu có year) ===
    if (year && !month && !week) {
      revenueQb
        .andWhere('YEAR(order.createdAt) = :year', { year })
        .addSelect('YEAR(order.createdAt)', 'year')
        .addSelect('MONTH(order.createdAt)', 'month')
        .groupBy('MONTH(order.createdAt)')
        .addGroupBy('YEAR(order.createdAt)')
        .orderBy('MONTH(order.createdAt)', 'ASC');
    }

    // === Thống kê theo tuần trong tháng (nếu có year + month) ===
    if (year && month && !week) {
      revenueQb
        .andWhere('YEAR(order.createdAt) = :year', { year })
        .andWhere('MONTH(order.createdAt) = :month', { month })
        .addSelect('YEAR(order.createdAt)', 'year')
        .addSelect('MONTH(order.createdAt)', 'month')
        .addSelect('FLOOR((DAY(order.createdAt)-1)/7)+1', 'week')
        .groupBy('week')
        .addGroupBy('MONTH(order.createdAt)')
        .addGroupBy('YEAR(order.createdAt)')
        .orderBy('week', 'ASC');
    }

    // === Thống kê theo ngày (nếu có year + month + week) ===
    if (year && month && week) {
      revenueQb
        .andWhere('YEAR(order.createdAt) = :year', { year })
        .andWhere('MONTH(order.createdAt) = :month', { month })
        .andWhere('FLOOR((DAY(order.createdAt)-1)/7)+1 = :week', { week })
        .addSelect('YEAR(order.createdAt)', 'year')
        .addSelect('MONTH(order.createdAt)', 'month')
        .addSelect('FLOOR((DAY(order.createdAt)-1)/7)+1', 'week')
        .addSelect('DAY(order.createdAt)', 'day')
        .groupBy('DAY(order.createdAt)')
        .addGroupBy('week')
        .addGroupBy('MONTH(order.createdAt)')
        .addGroupBy('YEAR(order.createdAt)')
        .orderBy('DAY(order.createdAt)', 'ASC');
    }

    const revenueData = (await revenueQb.getRawMany()).map((item) => {
      return {
        ...item,
        week: Number(item.week),
      };
    });

    // Trả kết quả
    return {
      week: week,
      month: month,
      year: year ?? new Date().getFullYear(),
      revenueTotal: Number(rawData.revenue),
      revenue: revenueData,
      quantityDelivered: Number(rawData.quantityDelivered),
      quantityPending: Number(rawData.quantityPending),
      quantityCancelled: Number(rawData.quantityCancelled),
      quantityReturned: Number(rawData.quantityReturned),
      bestSellingProducts: topProducts,
    };
  }
}
