// backend/src/modules/carts/carts.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // Tạo mới giỏ hàng (thường được tạo tự động cho user mới, nhưng vẫn có endpoint này cho admin nếu cần)
  @Post()
  create() {
    return this.cartsService.create();
  }

  // Lấy danh sách tất cả các giỏ hàng (dành cho admin)
  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  // Lấy giỏ hàng theo id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }

  // Xóa giỏ hàng theo id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }

  // Checkout giỏ hàng: cập nhật isCheckedOut = true cho giỏ hàng có id tương ứng
  // Vì checkout là hành động luôn đặt isCheckedOut thành true, nên không cần truyền body.
  @Patch(':id/checkout')
  checkout(@Param('id') id: string) {
    return this.cartsService.checkout(+id);
  }

  @Get('/user/:user_id')
  findByUserId(@Param('user_id') user_id: string) {
    return this.cartsService.findByUserId(+user_id);
  }
}
