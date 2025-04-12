import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartProduct } from 'src/entities/cart_product.entity';
import { Cart } from 'src/entities/cart.entity';
import { CreateCartProductDto } from './dtos/createCart_Product.dto';
import { UpdateCartProductDto } from './dtos/updateCart_Product.dto';


@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProduct)
    private readonly cartProductRepo: Repository<CartProduct>,
    
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
  ) {}

  async addToCart(dto: CreateCartProductDto): Promise<CartProduct> {
    // 1. Kiểm tra Cart tồn tại
    const cart = await this.cartRepo.findOne({ 
      where: { id: dto.cartId }
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${dto.cartId} not found`);
    }

    // 2. Kiểm tra sản phẩm đã có trong giỏ chưa (không validate Product entity)
    const existingItem = await this.cartProductRepo.findOne({
      where: {
        cart: { id: dto.cartId },
        product: { id: dto.productId } // Coi productId như foreign key thông thường
      }
    });

    if (existingItem) {
      // 3. Nếu có -> Cập nhật số lượng
      existingItem.quantity += dto.quantity;
      return this.cartProductRepo.save(existingItem);
    }

    // 4. Nếu chưa có -> Tạo mới
    const newItem = this.cartProductRepo.create({
      cart: { id: dto.cartId },
      product: { id: dto.productId }, // Lưu trực tiếp productId
      quantity: dto.quantity
    });

    return this.cartProductRepo.save(newItem);
  }

  async updateCartItem(id: number, dto: UpdateCartProductDto): Promise<CartProduct> {
    const item = await this.cartProductRepo.findOne({ 
      where: { id },
      relations: ['cart'] // Chỉ cần load cart để check ownership
    });
    
    if (!item) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    // Cập nhật số lượng (nếu có)
    if (dto.quantity !== undefined) {
      item.quantity = dto.quantity;
    }

    return this.cartProductRepo.save(item);
  }

  async removeFromCart(id: number): Promise<void> {
    const result = await this.cartProductRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
  }
}