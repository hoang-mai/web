import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order_item.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { CreateOrderDto } from './dtos/createOrder.dto';

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
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product)
        throw new NotFoundException(`Product with id ${item.productId} not found`);
      if (product.stock < item.quantity)
        throw new BadRequestException(`Not enough stock for product ${product.name}`);

      product.stock -= item.quantity;
      await this.productRepository.save(product);

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        order,
      });

      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);
    order.orderItems = orderItems;
    return this.orderRepository.save(order);
  }

  // ✅ FIND ALL
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
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

  // ✅ UPDATE (basic fields — customize as needed)
  async update(id: number, updateData: Partial<Order>): Promise<Order | null> {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    Object.assign(order, updateData);
    return this.orderRepository.save(order);
  }

  // ✅ DELETE
  async delete(id: number): Promise<void> {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);

    // Optional: Restore stock if needed before deleting
    for (const item of order.orderItems) {
      const product = await this.productRepository.findOne({ where: { id: item.product.id } });
      if (product) {
        product.stock += item.quantity;
        await this.productRepository.save(product);
      }
    }

    await this.orderRepository.remove(order); // cascade deletes orderItems if set up
  }
}
