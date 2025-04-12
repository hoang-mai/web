import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateCartProductDto {
  @IsNotEmpty()
  @IsInt()
  cartId: number;

  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
