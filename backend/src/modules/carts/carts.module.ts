import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "src/entities/cart.entity";
import { CartsService } from "./carts.service";
import { CartsController } from "./carts.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  providers: [CartsService],
  controllers: [CartsController],

})
export class CartsModule {}
