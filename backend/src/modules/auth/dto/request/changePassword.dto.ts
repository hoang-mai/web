import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Mật khẩu cũ là một chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống!' })
  oldPassword: string;

  @IsString({ message: 'Mật khẩu mới là một chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống!' })
  newPassword: string;
}
