import { PartialType } from '@nestjs/mapped-types';
import { CreateCartProductDto } from './createCart_Product.dto';

export class UpdateCartProductDto extends PartialType(CreateCartProductDto) {}
