// File: backend/src/modules/products/products.service.ts
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dto/request/createProduct.dto';
import { UpdateProductDto } from './dto/request/updateProduct.dto';
import { PageDto } from './dto/response/page.dto';
import { StatisticProductDto } from '../statistics/dto/response/statisticProduct.dto';
import { Category } from 'src/entities/category.enum';

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
      where: { name: createProductDto.name },
    });
    if (existingProduct) {
      throw new HttpException('Tồn tại sản phẩm trùng tên', 400);
    }
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  /**
   * Cập nhật thông tin sản phẩm.
   * @param id ID của sản phẩm cần cập nhật.
   * @param updateProductDto Thông tin cập nhật sản phẩm.
   * @returns Sản phẩm đã được cập nhật.
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${id} không tìm thấy`);
    }

    if (updateProductDto.name) {
      const existingProduct = await this.productRepository.findOne({
        where: {
          name: updateProductDto.name,
          id: Not(id), // Exclude current product
        },
      });

      if (existingProduct) {
        throw new HttpException('Tồn tại sản phẩm trùng tên', 400);
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  /**
   * Xóa sản phẩm bằng cách đánh dấu là đã xóa (isDeleted = true).
   * @param id ID của sản phẩm cần xóa.
   * @returns void
   */
  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${id} không tìm thấy`);
    }
    product.isDeleted = true;
    await this.productRepository.save(product);
  }

  /**
   * Khôi phục sản phẩm đã xóa (isDeleted = true).
   * @param id ID của sản phẩm cần khôi phục.
   * @returns Sản phẩm đã khôi phục.
   */
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
   * Lấy danh sách sản phẩm theo trang và số lượng sản phẩm trên mỗi trang bởi admin.
   * @param page - Số trang hiện tại.
   * @param limit - Số lượng sản phẩm trên mỗi trang.
   * @param orderBy - Trường để sắp xếp (mặc định là 'createdAt').
   * @param order - Thứ tự sắp xếp (mặc định là 'DESC').
   * @param search - Từ khoá tìm kiếm (mặc định là '').
   * @param isDeleted - Trạng thái sản phẩm (mặc định là null).
   * @param category - Danh mục sản phẩm (mặc định là null).
   * Sắp xếp theo thời gian tạo sản phẩm giảm dần.
   * @returns Danh sách sản phẩm theo trang và số lượng sản phẩm trên mỗi trang.
   */
  async findAllByAdmin(
    page: number,
    limit: number,
    orderBy: string,
    order: 'ASC' | 'DESC',
    search: string,
    isDeleted: boolean | null,
    category: Category | null,
  ) {
    const query = this.productRepository.createQueryBuilder('product');

    if (search && search.trim() !== '') {
      query.andWhere('LOWER(product.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    if (isDeleted != null) {
      query.andWhere('product.isDeleted = :isDeleted', { isDeleted });
    }

    if (category != null) {
      query.andWhere('product.category = :category', { category });
    }

    const orderField = `product.${orderBy}`;
    query.orderBy(orderField, order === 'ASC' ? 'ASC' : 'DESC');

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return new PageDto(page, limit, total, data);
  }

  /**
   * Thống kê tổng số sản phẩm, số sản phẩm đang hoạt động và số sản phẩm đã ngừng hoạt động.
   * @returns Thống kê sản phẩm.
   */
  async statisticProduct() {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('product.isDeleted', 'isDeleted')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.isDeleted')
      .getRawMany();

    return {
      total: result.reduce((acc, item) => acc + Number(item.count), 0),
      active: Number(
        result.find((item) => item.isDeleted == false)?.count ?? 0,
      ),
      inactive: Number(
        result.find((item) => item.isDeleted == true)?.count ?? 0,
      ),
    };
  }

  /**
   * Thống kê thông tin chi tiết của một sản phẩm.
   *
   * @param {number} productId - ID của sản phẩm cần thống kê.
   * @returns {Promise<StatisticProductDto>} - Dữ liệu thống kê của sản phẩm.
   * @throws {NotFoundException} - Nếu không tìm thấy sản phẩm với ID đã cho.
   */
  async statisticProductById(productId: number): Promise<StatisticProductDto> {
    console.log('productId', productId);
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
      .addSelect('COUNT(review.rating)', 'totalRating')
      .addSelect('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'totalReview')
      .addSelect('SUM(orderItem.quantity * orderItem.price)', 'totalSold')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('product.reviews', 'review')
      .where('product.id = :id', { id: productId })
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
