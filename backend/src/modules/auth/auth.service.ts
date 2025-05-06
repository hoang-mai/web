import { Inject, Injectable ,UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import { TokenExpiredError } from 'jsonwebtoken'; // cần nếu muốn phân loại rõ


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject("JwtAccessService") private readonly jwtAccessService: JwtService,
    @Inject("JwtRefreshService") private readonly jwtRefreshService: JwtService,
  ) {}

  register(registerDto: any) {
    return this.usersService.create(registerDto);
  }
  validateUser(email: string, password: string) {
    return this.usersService.validateUser(email, password)
  }

  login(user: any) {
    const payload = { email: user.email, sub: user.id, role:user.role};
    return {
      access_token: this.jwtAccessService.sign(payload),
      refresh_token: this.jwtRefreshService.sign(payload),

    };
  }

refreshToken(token: string) {
  try {
    const payload = this.jwtRefreshService.verify(token); 

    // tạo access token mới
    return {
      access_token: this.jwtAccessService.sign({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      }),
    };
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }
    throw new UnauthorizedException('Refresh token không hợp lệ');
  }
}

  
}
