import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role.enum';
import { Order } from 'src/entities/order.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(user: User, createReviewDto: CreateReviewDto) {
    const product = await this.productRepo.findOneByOrFail({
      name: createReviewDto.productName,
    });

    // Kiểm tra đã từng mua sản phẩm
    const hasPurchased = await this.orderRepo
      .createQueryBuilder('order')
      .innerJoin('order.user', 'user')
      .innerJoin('order.orderItems', 'item')
      .innerJoin('item.product', 'product')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('product.id = :productId', { productId: product.id })
      .getCount();

    if (!hasPurchased) {
      throw new ForbiddenException(
        'Quý khách cần mua sản phẩm trước khi đánh giá.',
      );
    }

    // Kiểm tra đã review chưa
    const existing = await this.reviewRepo.findOne({
      where: {
        user: { id: user.id },
        product: { id: product.id },
      },
    });

    if (existing) {
      throw new ConflictException('Quý khách đã đánh giá sản phẩm này.');
    }

    // Tạo đánh giá mới
    const review = this.reviewRepo.create({
      rating: createReviewDto.rating,
      review: createReviewDto.review,
      imageUrl: createReviewDto.imageUrl,
      user,
      product,
    });

    return await this.reviewRepo.save(review);
  }

  async getReviewsByProduct(productName: string) {
    return await this.reviewRepo.find({
      where: { product: { name: productName } },
      relations: ['user', 'reviewComments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProductReviewStats(productName: string) {
    const reviews = await this.reviewRepo.find({
      where: { product: { name: productName } },
    });

    const total = reviews.length;
    const average =
      total > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total
        : 0;

    const starBreakdown: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((r) => {
      const rating = r.rating;
      if (rating && rating >= 1 && rating <= 5) {
        starBreakdown[rating]++;
      }
    });

    return {
      totalReviews: total,
      averageRating: parseFloat(average.toFixed(1)),
      starBreakdown,
    };
  }

  findAll() {
    return `This action returns all review`;
  }

  async findOne(id: number) {
    return this.reviewRepo.findOne({
      where: { id },
      relations: ['user', 'reviewComments'],
    });
  }

  async update(id: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.reviewRepo.findOne({
      where: { id: id },
      relations: ['user'],
    });
    console.log(review, userId);
    if (!review || review.user.id !== userId) {
      throw new ForbiddenException('Bạn không được phép sửa bình luận này');
    }

    Object.assign(review, dto);
    return this.reviewRepo.save(review);
  }

  async remove(id: number, userId: number) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    const userReq = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (review && userReq && userReq.role === Role.ADMIN)
      return this.reviewRepo.delete(id);
    else if (!review || review.user.id !== userId) {
      throw new ForbiddenException('Bạn không được phép xóa bình luận này');
    }

    return this.reviewRepo.delete(id);
  }
  async findAllWithUserAndProduct() {
    return this.reviewRepo.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async forceDeleteReview(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Đánh giá không tồn tại.');
    return this.reviewRepo.remove(review);
  }
}
