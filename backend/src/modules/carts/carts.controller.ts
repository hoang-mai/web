// backend/src/modules/carts/carts.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Request,
  Res,
  Body, Req, Query, UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../guard/roles.decorator';
import { Role } from '../../entities/role.enum';

@Controller()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // Tạo mới giỏ hàng (thường được tạo tự động cho user mới, nhưng vẫn có endpoint này cho admin nếu cần)
  @Post('carts')
  create() {
    return this.cartsService.create();
  }

  // Tạo giỏ hàng mới cho người dùng theo user_id, dùng khi đăng ký mới
  @Post('/user/:user_id')
  createCartForUser(@Param('user_id') user_id: string) {
    return this.cartsService.createCartForUser(+user_id);
  }

  // Lấy danh sách tất cả các giỏ hàng (dành cho admin)
  @Get('carts')
  findAll() {
    return this.cartsService.findAll();
  }

  // Lấy giỏ hàng theo id
  @Get('carts/:id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }

  // Xóa giỏ hàng theo id
  @Delete('carts/:id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }

  // Checkout giỏ hàng: cập nhật isCheckedOut = true cho giỏ hàng có id tương ứng
  // Vì checkout là hành động luôn đặt isCheckedOut thành true, nên không cần truyền body.
  @Patch('carts/:id/checkout')
  checkout(@Param('id') id: string) {
    return this.cartsService.checkout(+id);
  }

  @Get('carts/user/:user_id')
  findByUserId(@Param('user_id') user_id: string) {
    return this.cartsService.findByUserId(+user_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.USER])
  @Post('carts/create-payment-url')
  async createPaymentUrl(
    @Body() createPayment: CreatePaymentDto,
    @Req() req: any,
    @Request() reqGuard: any,
  ): Promise<{ url: string }> {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);
    console.log(ipAddr)
    return await this.cartsService.createPayment(
      createPayment,
      ipAddr,
      reqGuard.user.id,
    );
  }

  @Get('/vnpay_ipn')
  async vnpayIpn(@Query() query: any) {
    return await this.cartsService.vnpayIpn(query);
  }
}
