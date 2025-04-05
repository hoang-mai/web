import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN) // Chỉ Admin được phép
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postService.create(createPostDto, req.user);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  update(
    @Param('id') id: number,
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ) {
    return this.postService.update(+id, createPostDto, req.user);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  remove(@Param('id') id: number, @Request() req) {
    return this.postService.remove(+id, req.user);
  }
}
