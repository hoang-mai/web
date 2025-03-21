import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dtos/createProduct.dto";
import { UpdateProductDto } from "./dtos/updateProduct.dto";
import { Product } from "src/entities/product.entity";

@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: number): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Patch(":id")
    update(
        @Param("id") id: number,
        @Body() updateProductDto: UpdateProductDto
    ): Promise<Product> {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(":id")
    remove(@Param("id") id: number): Promise<void> {
        return this.productsService.remove(id);
    }
}
