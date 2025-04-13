import { IsArray, IsInt, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../../order_item/dtos/createOrderItem.dto';  // Relative path

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;  // ID of the user placing the order

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];  // List of items in the order
}
