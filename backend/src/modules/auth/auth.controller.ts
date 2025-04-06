import { Body, Controller, Post, UseGuards, Request, Get, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/request/register.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/request/login.dto';
import { Roles } from 'src/guard/roles.decorator';
import { Role } from 'src/entities/role.enum';
import { RolesGuard } from 'src/guard/roles.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
   login(@Request() req: any) {
    return {
      status_code: HttpStatus.OK,
      message: 'Đăng nhập thành công',
      data:  this.authService.login(req.user),
    };
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
