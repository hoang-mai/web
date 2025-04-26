import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dtos/request/createProduct.dto';
import { UpdateProductDto } from './dtos/request/updateProduct.dto';
import { PageDto } from './dtos/response/page.dto';
import { StatisticProductDto } from '../statistics/dto/statisticProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
      throw new NotFoundException(`Sản phẩm với ID ${id} không tìm thấy`);
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

  /**
   * Thống kê thông tin chi tiết của một sản phẩm.
   *
   * @param {number} productId - ID của sản phẩm cần thống kê.
   * @returns {Promise<StatisticProductDto>} - Dữ liệu thống kê của sản phẩm.
   * @throws {NotFoundException} - Nếu không tìm thấy sản phẩm với ID đã cho.
   */
  async statisticProduct(productId: number): Promise<StatisticProductDto> {
    const result: StatisticProductDto | undefined = await this.productRepository
      .createQueryBuilder('product')
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.price', 'price')
      .addSelect('product.stock', 'stock')
      .addSelect('product.description', 'description')
      .addSelect('product.imageUrl', 'imageUrl')
      .addSelect('product.discount', 'discount')
      .addSelect('product.category', 'category')
      .addSelect('SUM(orderItem.quantity)', 'quantitySold')
      .addSelect('SUM(review.rating)', 'totalRating')
      .addSelect('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'totalReview')
      .addSelect('SUM(orderItem.quantity * orderItem.price)', 'totalSold')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('product.reviews', 'review')
      .where('product.id = :id', { id: productId })
      .andWhere('order.status = :status', { status: 'delivered' })
      .getRawOne();
    if (!result) {
      throw new NotFoundException(
        `Sản phẩm với ID ${productId} không tìm thấy`,
      );
    }
    return result;
  }

  /**
   * Kiểm tra xem sản phẩm có tồn tại hay không.
   * @param productId ID của sản phẩm cần kiểm tra.
   * @return void
   * @throws NotFoundException nếu sản phẩm không tồn tại.
   */
  async checkProductExists(productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${productId} không tồn tại`);
    }
  }
}
