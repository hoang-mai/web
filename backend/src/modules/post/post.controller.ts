import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from 'src/entities/role.enum';
import { Roles } from 'src/guard/roles.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.create(createPostDto, req.user);
  }

  @Get('user-side')
  findVisiblePosts() {
    return this.postService.findVisiblePosts();
  }

  @Get('admin-side')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  findAll() {
    return this.postService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postService.update(+id, updatePostDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  remove(@Param('id') id: number, @Request() req) {
    return this.postService.remove(+id, req.user);
  }
}
