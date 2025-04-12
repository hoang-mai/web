
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {

    const existingUser = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }
    data.password = await bcrypt.hash(data.password!, 10);
    return this.userRepository.save(data);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });

    if(!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không chính xác');

    }
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, data: Partial<User>): Promise<any> {
    return this.userRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
