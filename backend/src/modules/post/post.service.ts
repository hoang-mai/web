import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, admin: User) {
    console.log(createPostDto);
    const post = this.postRepository.create({
      ...createPostDto,
      author: admin,
    });
    return await this.postRepository.save(post);
  }

  async findVisiblePosts() {
    return this.postRepository.find({
      where: { isVisible: true },
      order: { createdAt: 'DESC' },
    });
  }
  async findAll() {
    return await this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto, admin: User) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    if (post.author.id !== admin.id) {
      throw new ForbiddenException('Bạn không có quyền sửa bài viết này');
    }

    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async remove(id: number, admin: User) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    if (post.author.id !== admin.id) {
      throw new ForbiddenException('Bạn không có quyền xoá bài viết này');
    }

    await this.postRepository.delete(id);
    return { message: 'Xóa bài viết thành công' };
  }
}
