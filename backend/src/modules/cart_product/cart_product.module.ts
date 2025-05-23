import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductService } from './cart_product.service';
import { CartProductController } from './cart_product.controller';
import { CartProduct } from 'src/entities/cart_product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartProduct])],
  controllers: [CartProductController],
  providers: [CartProductService],
  exports: [CartProductService],
})
export class CartProductModule {}
