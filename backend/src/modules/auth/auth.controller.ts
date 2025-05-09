import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/request/register.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/request/login.dto';
import { RefreshTokenDto } from './dto/request/refreshToken.dto';
import { ChangePasswordDto } from './dto/request/changePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return {
      status_code: HttpStatus.CREATED,
      message: 'Đăng ký thành công',
      data: await this.authService.register(registerDto),
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Request() req: any) {
    return {
      status_code: HttpStatus.OK,
      message: 'Đăng nhập thành công',
      data: this.authService.login(req.user),
    };
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-token')
  checkTokenRoute(@Request() req: any) {
    return {
      status_code: HttpStatus.OK,
      message: 'Token hợp lệ',
      data: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }
  @Post('refresh-token')
   refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return {
      status_code: HttpStatus.OK,
      message: 'Làm mới token thành công',
      data: this.authService.refreshToken(refreshTokenDto.refreshToken),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req: any, @Body() body: ChangePasswordDto) {
    const userId = req.user.id;
    const newPassword = body.newPassword;
    const oldPassword = body.oldPassword;
    await this.authService.changePassword(userId, newPassword, oldPassword);
    return {
      status_code: HttpStatus.OK,
      message: 'Đổi mật khẩu thành công',
    };
  }
}
