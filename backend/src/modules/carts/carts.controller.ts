import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';


@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) {}

  @Post()
  create() {
    return this.cartService.create();
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
  @Patch(':id/checkout')
    checkout(@Param('id') id: string, @Body('isCheckedOut') isCheckedOut: boolean) {
    return this.cartService.checkout(+id, isCheckedOut);
}
}
