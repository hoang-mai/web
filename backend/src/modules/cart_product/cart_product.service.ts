import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartProduct } from 'src/entities/cart_product.entity';
import { CreateCartProductDto } from './dtos/createCart_Product.dto';
import { UpdateCartProductDto } from './dtos/updateCart_Product.dto';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
  ) {}

  async create(createCartProductDto: CreateCartProductDto): Promise<CartProduct> {
    const cartProduct = this.cartProductRepository.create(createCartProductDto);
    return this.cartProductRepository.save(cartProduct);
  }

  async findAll(): Promise<CartProduct[]> {
    return this.cartProductRepository.find({ relations: ['cart', 'product'] });
  }

  async findOne(id: number): Promise<CartProduct> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: { id },
      relations: ['cart', 'product'],
    });
    if (!cartProduct) throw new NotFoundException(`Cart Product #${id} not found`);
    return cartProduct;
  }

  async update(id: number, updateCartProductDto: UpdateCartProductDto): Promise<CartProduct> {
    await this.cartProductRepository.update(id, updateCartProductDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cartProductRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Cart Product #${id} not found`);
  }

  async clearCart(cartId: number): Promise<void> {
    await this.cartProductRepository.delete({ cart: { id: cartId } });
  }
}
