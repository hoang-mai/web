import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'refreshToken phải là chuỗi' })
  @IsNotEmpty({ message: 'refreshToken không được để trống' })
  refreshToken: string;
}
