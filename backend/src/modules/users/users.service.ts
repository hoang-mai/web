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

  async findAll(offset: number, limit: number): Promise<{ data: User[], total: number }> {
    const users = await this.userRepository.find({
      skip: offset,
      take: limit,
      select: ['id', 'email', 'firstName', 'lastName', 'role','phone','imageUrl','address'],
    });
    const total = await this.userRepository.count();
    return { data: users, total };  // Trả về một đối tượng với dữ liệu và tổng số
  }

  async findOne(id: number): Promise<User | null> {
    // Tìm người dùng theo id và loại bỏ trường password
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role','phone','imageUrl','address'], // Chọn các trường cần thiết, không bao gồm password
    });

    if (!user) {
      return null;
    }

    return user;
  }


  async update(id: number, data: Partial<User>): Promise<any> {
    const result = await this.userRepository.update(id, data);
    return result;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * Tìm người dùng theo ID.
   * @param id ID của người dùng.
   * @returns Người dùng nếu tìm thấy, ngược lại trả về null.
   */
  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async changePassword(userId: number, newPassword: string, oldPassword: string): Promise<void> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Mật khẩu cũ không chính xác');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }
}
