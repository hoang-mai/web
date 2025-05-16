import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/entities/role.enum';

export class RegisterDto {
  @IsString({ message: 'Họ phải là một chuỗi' })
  @IsNotEmpty({ message: 'Họ không được để trống' })
  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  firstName: string;

  @IsString({ message: 'Tên phải là một chuỗi' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  lastName: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsString({ message: 'Email phải là một chuỗi' })
  @IsNotEmpty()
  @ApiProperty({ description: 'email', example: 'user@example.com' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: Role.USER,
  })
  role?: Role;
}
