import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;  // ID of the product being ordered

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;  // Quantity of the product being ordered
}
