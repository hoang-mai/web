import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(data: Partial<User>): Promise<User> {
    return this.userRepository.save(data);
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
