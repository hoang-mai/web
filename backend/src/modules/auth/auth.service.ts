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

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
