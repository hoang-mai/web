import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({message: 'Email phải là một chuỗi'})
  @IsNotEmpty({message: 'Email không được để trống'})
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email: string;

  @IsString({message: 'Mật khẩu phải là một chuỗi'})
  @IsNotEmpty({message: 'Mật khẩu không được để trống'})
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;
}
