// backend/src/modules/carts/carts.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartProduct } from 'src/entities/cart_product.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
  ) {}

  // Tạo mới giỏ hàng. 
  // Lưu ý: Trong thực tế, giỏ hàng thường được tạo tự động khi người dùng đăng ký,
  // nhưng endpoint này có thể dùng cho admin hoặc mục đích test.
  async create(): Promise<Cart> {
    // Nếu Cart có quan hệ bắt buộc với User, bạn cần cung cấp userId tại đây.
    // Ở đây tạo đơn giản với isCheckedOut = false.
    const cart = this.cartRepository.create({
      isCheckedOut: false,
    });
    return await this.cartRepository.save(cart);
  }

  // Lấy danh sách tất cả giỏ hàng, bao gồm các sản phẩm trong giỏ (qua quan hệ CartProduct)
  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.find({
      relations: ['cartProducts', 'cartProducts.product'],
    });
  }

  // Lấy thông tin giỏ hàng theo id
  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartProducts', 'cartProducts.product'],
    });
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  // Lấy thông tin giỏ hàng theo user id
  async findByUserId(user_id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user_id } },
      relations: ['cartProducts', 'cartProducts.product'],
    });
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  // Xóa giỏ hàng theo id (dành cho admin)
  async remove(id: number): Promise<void> {
    const result = await this.cartRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
  }

  // Thực hiện checkout giỏ hàng: cập nhật isCheckedOut = true
  async checkout(id: number): Promise<Cart> {
    const cart = await this.findOne(id);
    if (cart.isCheckedOut) {
      throw new HttpException('Cart already checked out', HttpStatus.BAD_REQUEST);
    }

    // Nếu cần, bạn có thể bổ sung logic xử lý (ví dụ: kiểm tra tồn kho, giảm số lượng sản phẩm, ...)
    cart.isCheckedOut = true;
    return await this.cartRepository.save(cart);
  }
}
