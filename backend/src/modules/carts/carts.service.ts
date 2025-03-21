import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/entities/cart.entity';


@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async create(): Promise<Cart> {
    const cart = this.cartRepository.create();
    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['cartProducts', 'user'] });
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartProducts', 'user'],
    });
    if (!cart) throw new NotFoundException(`Cart #${id} not found`);
    return cart;
  }

  async remove(id: number): Promise<void> {
    const result = await this.cartRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Cart #${id} not found`);
  }
  async checkout(id: number, isCheckedOut:boolean): Promise<Cart> {
    const cart = await this.findOne(id);
    cart.isCheckedOut = isCheckedOut;
    return this.cartRepository.save(cart);
  }
}
