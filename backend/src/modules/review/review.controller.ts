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

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.user, createReviewDto);
  }

  @Get('products/:productId')
  async getByProduct(@Param('productId') productId: number) {
    return this.reviewService.getReviewsByProduct(productId);
  }
  @Get('products/:productId/stats')
  getStats(@Param('productId') productId: number) {
    return this.reviewService.getProductReviewStats(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(req.user, +id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.reviewService.remove(+id, req.user);
  }
}
