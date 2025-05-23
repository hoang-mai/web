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
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'email', example: 'user@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
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
