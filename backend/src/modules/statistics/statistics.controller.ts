import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Roles } from 'src/guard/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from 'src/entities/role.enum';

@Controller('statistics')
@Roles([Role.ADMIN])
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/admin/product/:productId')
  async statisticProduct(@Param('productId') productId: number) {
    return {
      message: 'Lấy chi tiết sản phẩm thành công',
      status_code: 200,
      data: await this.statisticsService.statisticProduct(productId)
    };
  }

  @Get('/admin/revenue/product/:productId')
  async statisticRevenueProduct(
    @Param('productId') productId: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    const data =await this.statisticsService.statisticRevenueProduct(
      productId,
      year,
      month,
    );
    return {
      message: 'Lấy doanh thu sản phẩm thành công',
      status_code: 200,
      data,
    };
  }
}
