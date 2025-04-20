import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
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
    async findAll(
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10
    ): Promise<{ data: Product[]; total: number }> {
        return this.productsService.findAll(page, limit);
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

    @Patch(":id/restore")
    restore(@Param("id") id: number): Promise<Product> {
        return this.productsService.restore(id);
    }

    @Delete(":id")
    remove(@Param("id") id: number): Promise<void> {
        return this.productsService.remove(id);
    }
}
