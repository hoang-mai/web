import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/request/createProduct.dto';
import { UpdateProductDto } from './dtos/request/updateProduct.dto';
import { Product } from 'src/entities/product.entity';
import { PageDto } from './dtos/response/page.dto';
import { Http } from 'winston/lib/winston/transports';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const data = await this.productsService.findAll(page, limit);
    return {
      message: 'Lấy danh sách sản phẩm thành công',
      status_code: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: number): Promise<Product> {
    return this.productsService.restore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
