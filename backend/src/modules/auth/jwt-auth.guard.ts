import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token đã hết hạn');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    if (err || !user) {
      throw err ?? new UnauthorizedException();
    }
    return user;
  }
}
