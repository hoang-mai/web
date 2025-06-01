// backend/src/modules/cart_product/cart_product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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
      if (dto.quantity !== undefined && dto.quantity !== null) {
        if ( dto.quantity > 0 ) {
        item.quantity = item.quantity + dto.quantity;
        }
      }

    return this.cartProductRepo.save(item);
  }

  async removeFromCart(id: number): Promise<void> {
    const result = await this.cartProductRepo.delete(id);
    if (result.affected === 0 ) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
  }

  async findAll(): Promise<CartProduct[]> {
    return this.cartProductRepo.find({
      relations: ['cart', 'product'], // Load các quan hệ nếu cần
    });
  }
  
  async findOne(id: number): Promise<CartProduct> {
    const item = await this.cartProductRepo.findOne({
      where: { id },
      relations: ['cart', 'product'], // Load các quan hệ nếu cần
    });
    if (!item) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
    return item;
  }
  
  async update(id: number, dto: UpdateCartProductDto): Promise<CartProduct> {
    const item = await this.findOne(id); // Tái sử dụng phương thức findOne
    if (dto.quantity !== undefined) {
      item.quantity = dto.quantity;
    }
    return this.cartProductRepo.save(item);
  }
  
  async remove(id: number): Promise<void> {
    const result = await this.cartProductRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
  }
  
  async clearCart(cartId: number): Promise<void> {
    const result = await this.cartProductRepo.delete({ cart: { id: cartId } });
    if (result.affected === 0) {
      throw new NotFoundException(`No items found in cart with ID ${cartId}`);
    }
  }

  async removeItemFromCart(userId: number, productId: number): Promise<void> {
    // 1.Lấy cartId theo userId
    const cart = await this.cartRepo.findOne({where: { user: { id: userId } }});
    if (!cart) {
      throw new NotFoundException(`Lỗi cart này brooo, id là ${userId}`);
    }

    // 2.Xóa item theo cartId và productId
    const result = await this.cartProductRepo.delete({
      cart: { id: cart.id },
      product: { id: productId }
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${productId} trong giỏ hàng của người dùng ${userId}`);
    }
  }
}