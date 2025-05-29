import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "src/entities/cart.entity";
import { CartsController } from "./carts.controller";
import { CartsService } from "./carts.service";
import { CartProduct } from 'src/entities/cart_product.entity';
import { User } from 'src/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { OrderItemsModule } from '../order_item/order_item.module';
import { ProductsModule } from '../products/products.module';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order_item.entity';
import { Product } from '../../entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartProduct,
      User,
      Order,
      OrderItem,
      Product,
    ]),
    ConfigModule,
    OrdersModule,
    UsersModule,
    OrderItemsModule,
    ProductsModule,
  ],
  controllers: [CartsController],
  providers: [
    CartsService,
    {
      provide: 'VNP',
      useFactory: async (configService: ConfigService) => ({
        vnp_TmnCode: configService.get<string>('VNP_TMN_CODE'),
        vnp_HashSecret: configService.get<string>('VNP_HASH_SECRET'),
        vnp_Api: configService.get<string>('VNP_API'),
        vnp_Url: configService.get<string>('VNP_URL'),
        vnp_ReturnUrl: configService.get<string>('VNP_RETURN_URL'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [CartsService],
})
export class CartsModule {}
