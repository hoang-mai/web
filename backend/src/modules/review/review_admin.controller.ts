import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/guard/roles.decorator';
import { Role } from 'src/entities/role.enum';

@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([Role.ADMIN])
export class ReviewAdminController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async findAll() {
    return this.reviewService.findAllWithUserAndProduct();
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.reviewService.forceDeleteReview(id);
  }
}
