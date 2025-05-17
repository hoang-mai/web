import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from 'src/entities/role.enum';
import { Roles } from 'src/guard/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll(page, limit);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>) {
    const result = await this.usersService.update(+id, userData);

    if (result.affected === 1) {
      return { success: true, message: 'Cập nhật thành công!' };
    } else {
      return { success: false, message: 'Không có thay đổi nào được thực hiện!' };
    }
  }


  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
