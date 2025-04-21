import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dtos/request/createProduct.dto';
import { UpdateProductDto } from './dtos/request/updateProduct.dto';
import { PageDto } from './dtos/response/page.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(page: number, limit: number) {
    const [data, total] = await this.productRepository.findAndCount({
      where: { isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return new PageDto(page, limit, total, data);
  }


  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!product) {
      throw new NotFoundException(`Product với ID ${id} không tìm thấy`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name, isDeleted: false },
    });
    if (existingProduct) {
      throw new Error('Tồn tại sản phẩm trùng tên');
    }
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    product.isDeleted = true;
    await this.productRepository.save(product);
  }

  async restore(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isDeleted: true },
    });
    if (!product) {
      throw new NotFoundException(`Product với ID ${id} không tìm thấy`);
    }
    product.isDeleted = false;
    return this.productRepository.save(product);
  }
}
