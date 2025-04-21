import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty({ message: "Bắt buộc cần có tên sản phẩm" })
    name: string;

    @IsNumber()
    @IsNotEmpty( { message: "Bắt buộc cần có giá tiền" })
    @Min(0, { message: "Giá sản phẩm phải lớn hơn hoặc bằng 0" })
    price: number;

    @IsNumber()
    @IsOptional({ message: "Số lượng sản phẩm không bắt buộc" })
    @Min(0, { message: "Số lượng sản phẩm phải lớn hơn hoặc bằng 0" })
    stock?: number;

    @IsString()
    @IsOptional({ message: "Mô tả sản phẩm không bắt buộc" })
    description?: string;

    @IsString()
    @IsOptional({ message: "Đường dẫn ảnh sản phẩm không bắt buộc" })
    imageUrl?: string;
}
