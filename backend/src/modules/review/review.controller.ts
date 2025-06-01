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
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from '../products/products.service';
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
  getByProduct(@Query('name') name: string) {
    return this.reviewService.getReviewsByProduct(name);
  }
  @Get('products/stats')
  getStats(@Query('name') name: string) {
    return this.reviewService.getProductReviewStats(name);
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
