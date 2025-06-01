import { IsInt, IsNotEmpty, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsNotEmpty({ message: 'Id sản phẩm không được để trống' })
  @IsInt()
  productId: number;

  @Min(1)
  quantity: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInt()
  price: number;
}

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Id giỏ hàng không được để trống' })
  @IsInt()
  cartId: number;

  @IsNotEmpty({ message: 'Sản phẩm trong giỏ hàng không được để trống' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cartItems: CartItemDto[];
}
