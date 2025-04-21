import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  register(registerDto: any) {
    return this.usersService.create(registerDto);
  }
  validateUser(email: string, password: string) {
    return this.usersService.validateUser(email, password)
  }

  login(user: any) {
    const payload = { email: user.email, sub: user.id, role:user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  checkToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, payload: decoded };
    } catch (error) {
      return { valid: false, message: 'Token không hợp lệ hoặc đã hết hạn' };
    }
  }
}
