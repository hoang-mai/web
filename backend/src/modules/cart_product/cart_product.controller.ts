// backend/src/modules/cart_product/cart_product.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Request } from '@nestjs/common';

import { CartProductService } from './cart_product.service';
import { CreateCartProductDto } from './dtos/createCart_Product.dto';
import { UpdateCartProductDto } from './dtos/updateCart_Product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart-products')
export class CartProductController {
  constructor(private readonly cartProductService: CartProductService) {}

  @Post()
  async create(@Body() createCartProductDto: CreateCartProductDto) {
    const data = await this.cartProductService.addToCart(createCartProductDto);
    return {
      message: 'Product đã được thêm vào giỏ hàng thành công',
      data,
      status_code: HttpStatus.CREATED,
    };
  }

  @Get()
  async findAll() {
    const data = await this.cartProductService.findAll();
    return {
      message: 'Lấy danh sách sản phẩm trong giỏ hàng thành công',
      data,
      status_code: HttpStatus.OK,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.cartProductService.findOne(+id);
    return {
      message: 'Lấy sản phẩm trong giỏ hàng thành công',
      data,
      status_code: HttpStatus.OK,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCartProductDto: UpdateCartProductDto,
  ) {
    const data = await this.cartProductService.updateCartItem(+id, updateCartProductDto);
    return {
      message: 'Cập nhật sản phẩm trong giỏ hàng thành công',
      data,
      status_code: HttpStatus.OK,
    };
  }

  // Xóa sản phẩm khỏi giỏ hàng theo id ? productId à ?
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cartProductService.removeFromCart(+id);
    return {
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      status_code: HttpStatus.OK,
    };
  }

  // Xóa tất cả sản phẩm trong giỏ hàng theo cartId
  @Delete('cart/:cartId/items')
  async clearCart(@Param('cartId') cartId: string) {
    await this.cartProductService.clearCart(+cartId);
    return {
      message: 'Xóa tất cả sản phẩm trong giỏ hàng thành công',
      status_code: HttpStatus.OK,
    };
  }

  @Delete('user/:userId/product/:productId')
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    await this.cartProductService.removeItemFromCart(+userId, +productId);
    return {
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      status_code: HttpStatus.OK,
    };
  }
}

