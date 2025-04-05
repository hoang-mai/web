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

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, admin: User) {
    const post = this.postRepository.create({
      ...createPostDto,
      author: admin,
    });
    return await this.postRepository.save(post);
  }

  async findAll() {
    return await this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, createPostDto: CreatePostDto, admin: User) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    if (post.author.id !== admin.id) {
      throw new ForbiddenException('Bạn không có quyền sửa bài viết này');
    }

    Object.assign(post, createPostDto);
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
