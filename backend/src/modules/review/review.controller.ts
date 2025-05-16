import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from '../products/products.service';
import { Role } from 'src/entities/role.enum';
import { Roles } from 'src/guard/roles.decorator';
import { CreateProductDto } from '../products/dto/request/createProduct.dto';

@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly productService: ProductsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.user, createReviewDto);
  }

  @Get('products')
  async getByProduct(@Body() productInfo: CreateProductDto) {
    return this.reviewService.getReviewsByProduct(productInfo.name);
  }
  @Get('products/stats')
  getStats(@Body() productInfo: CreateProductDto) {
    return this.reviewService.getProductReviewStats(productInfo.name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Body() updateReviewDto: UpdateReviewDto,
    @Param('id') id: number,
  ) {
    return this.reviewService.update(+id, req.user.id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.reviewService.remove(+id, req.user.id);
  }
}
