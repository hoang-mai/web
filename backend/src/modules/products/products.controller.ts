// File: backend/src/modules/products/products.controller.ts
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
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/createProduct.dto';
import { UpdateProductDto } from './dto/request/updateProduct.dto';
import { Product } from 'src/entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/guard/roles.decorator';
import { Role } from 'src/entities/role.enum';
import { RolesGuard } from 'src/guard/roles.guard';
import { Category } from 'src/entities/category.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Tạo sản phẩm mới
   * @param createProductDto Dữ liệu sản phẩm mới
   * @returns Sản phẩm đã được tạo
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Post('admin')
  async create(@Body() createProductDto: CreateProductDto) {
    return {
      message: 'Tạo sản phẩm thành công',
      status_code: HttpStatus.CREATED,
      data: await this.productsService.create(createProductDto),
    }
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

  /**
   *  Lấy danh sách sản phẩm cho admin
   * @param page
   * @param limit
   * @param orderBy
   * @param order
   * @param search
   * @param isDeleted
   * @param category
   * @returns Trả về danh sách sản phẩm
   */
  @Get('/admin')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAllByAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('orderBy', new DefaultValuePipe('createdAt')) orderBy: string,
    @Query('order', new DefaultValuePipe('DESC')) order: 'ASC' | 'DESC',
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('isDeleted') isDeletedRaw: string,
    @Query('category') categoryRaw: string,
  ) {
    // Extract the nested ternary operation
    let isDeleted: boolean | null = null;
    if (isDeletedRaw === 'true') {
      isDeleted = true;
    } else if (isDeletedRaw === 'false') {
      isDeleted = false;
    }
    let category: Category | null = null;
    if (categoryRaw === 'LAPTOP') {
      category = Category.LAPTOP;
    } else if (categoryRaw === 'MOBILE') {
      category = Category.MOBILE;
    } else if (categoryRaw === 'TABLET') {
      category = Category.TABLET;
    }

    return {
      message: 'Lấy danh sách sản phẩm thành công',
      status_code: HttpStatus.OK,
      data: await this.productsService.findAllByAdmin(
        page,
        limit,
        orderBy,
        order,
        search,
        isDeleted,
        category,
      ),
    };
  }

  /**
   *  Thống kê sản phẩm
   * @returns Trả về tổng số sản phẩm, số sản phẩm đang hoạt động, số sản phẩm đã ngừng hoạt động
   */
  @Get('/admin/statistic')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async statisticProduct() {
    return {
      message: 'Thống kê sản phẩm thành công',
      status_code: HttpStatus.OK,
      data: await this.productsService.statisticProduct(),
    };
  }
  /**
   * Khôi phục sản phẩm đã xóa (isDeleted = true).
   * @param id ID của sản phẩm cần khôi phục.
   * @returns Sản phẩm đã khôi phục.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Patch('admin/:id/restore')
  async restore(@Param('id') id: number) {
    return {
      message: 'Khôi phục sản phẩm thành công',
      status_code: HttpStatus.OK,
      data: await this.productsService.restore(id),
    };
  }

  /**
   * Xóa sản phẩm bằng cách đánh dấu là đã xóa (isDeleted = true).
   * @param id ID của sản phẩm cần xóa.
   * @returns void
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Delete('admin/:id')
  async remove(@Param('id') id: number) {
    await this.productsService.remove(id);
    return {
      message: 'Xóa sản phẩm thành công',
      status_code: HttpStatus.OK,
    };
  }
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }
  /**
   * Cập nhật sản phẩm
   * @param id ID của sản phẩm cần cập nhật
   * @param updateProductDto Dữ liệu cập nhật sản phẩm
   * @returns Sản phẩm đã được cập nhật
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  @Put('admin/:id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return {
      message: 'Cập nhật sản phẩm thành công',
      status_code: HttpStatus.OK,
      data: await this.productsService.update(id, updateProductDto),
    };
  }
}
