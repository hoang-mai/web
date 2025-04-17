import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartProductService } from './cart_product.service';
import { CreateCartProductDto } from './dtos/createCart_Product.dto';
import { UpdateCartProductDto } from './dtos/updateCart_Product.dto';

@Controller('cart-product')
export class CartProductController {
  constructor(private readonly cartProductService: CartProductService) {}

  @Post()
  create(@Body() createCartProductDto: CreateCartProductDto) {
    return this.cartProductService.addToCart(createCartProductDto);
  }

  @Get()
  findAll() {
    return this.cartProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartProductService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartProductDto: UpdateCartProductDto,
  ) {
    return this.cartProductService.updateCartItem(+id, updateCartProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartProductService.remove(+id);
  }

  @Delete('cart/:cartId/items')
  clearCart(@Param('cartId') cartId: string) {
    return this.cartProductService.clearCart(+cartId);
  }
}