import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "src/entities/cart.entity";
import { CartsController } from "./carts.controller";
import { CartsService } from "./carts.service";
import { CartProduct } from 'src/entities/cart_product.entity';
import { User } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartProduct, User])],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
