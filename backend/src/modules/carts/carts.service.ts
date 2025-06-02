// backend/src/modules/carts/carts.service.ts
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartProduct } from 'src/entities/cart_product.entity';
import { CreatePaymentDto } from './dto/createPayment.dto';
import * as dayjs from 'dayjs';

import * as qs from 'qs';
import * as crypto from 'crypto';
import { Order } from '../../entities/order.entity';
import { User } from '../../entities/user.entity';
import { OrderStatus } from '../../entities/order_status.enum';
import { OrderItem } from '../../entities/order_item.entity';
import { Product } from '../../entities/product.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('VNP')
    private readonly vnp: {
      vnp_TmnCode: string;
      vnp_HashSecret: string;
      vnp_Api: string;
      vnp_Url: string;
      vnp_ReturnUrl: string;
    },
  ) { }

  // Tạo mới giỏ hàng.
  // Lưu ý: Trong thực tế, giỏ hàng thường được tạo tự động khi người dùng đăng ký,
  // nhưng endpoint này có thể dùng cho admin hoặc mục đích test.
  async create(): Promise<Cart> {
    // Nếu Cart có quan hệ bắt buộc với User, bạn cần cung cấp userId tại đây.
    // Ở đây tạo đơn giản với isCheckedOut = false.
    const cart = this.cartRepository.create({
      isCheckedOut: false,
    });
    return await this.cartRepository.save(cart);
  }

  async createCartForUser(userId: number): Promise<Cart> {
    // Tạo giỏ hàng mới cho người dùng với isCheckedOut = false
    const cart = this.cartRepository.create({
      id: userId, //cartId = userId
      user: { id: userId }, // Giả sử Cart có quan hệ với User
      isCheckedOut: false,
    });
    return await this.cartRepository.save(cart);
  }

  // Lấy danh sách tất cả giỏ hàng, bao gồm các sản phẩm trong giỏ (qua quan hệ CartProduct)
  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.find({
      relations: ['cartProducts', 'cartProducts.product'],
    });
  }

  // Lấy thông tin giỏ hàng theo id
  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartProducts', 'cartProducts.product'],
    });
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  // Lấy thông tin giỏ hàng theo user id
  async findByUserId(user_id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user_id } },
      relations: ['cartProducts', 'cartProducts.product'],
    });
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  // Xóa giỏ hàng theo id (dành cho admin)
  async remove(id: number): Promise<void> {
    const result = await this.cartRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
  }

  // Thực hiện checkout giỏ hàng: cập nhật isCheckedOut = true
  async checkout(id: number): Promise<Cart> {
    const cart = await this.findOne(id);
    if (cart.isCheckedOut) {
      throw new HttpException(
        'Cart already checked out',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Nếu cần, bạn có thể bổ sung logic xử lý (ví dụ: kiểm tra tồn kho, giảm số lượng sản phẩm, ...)
    cart.isCheckedOut = true;
    return await this.cartRepository.save(cart);
  }

  async createPayment(
    createPayment: CreatePaymentDto,
    ipAddr: string,
    userId: number,
  ): Promise<{ url: string }> {
    const date = new Date();
    const createDate = dayjs(date).format('YYYYMMDDHHmmss');

    //create new order
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const order = this.orderRepository.create({
      user,
      totalPrice: createPayment.cartItems.reduce(
        (total, item: { price: number; quantity: number }) =>
          total + item.price * item.quantity,
        0,
      ),
      status: OrderStatus.PENDING, // Trạng thái ban đầu
      address: user.address,
    });
    await this.orderRepository.save(order);
    for (const item of createPayment.cartItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      if (!product) {
        throw new HttpException(
          `Product with id ${item.productId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      const orderItem = this.orderItemRepository.create({
        order,
        product: product,
        price: item.price,
        quantity: item.quantity,
      });
      this.orderItemRepository.save(orderItem);
    }

    const orderId = order.id;
    const amount = createPayment.cartItems.reduce(
      (total, item: { price: number; quantity: number }) =>
        total + item.price * item.quantity,
      0,
    );
    const locale = 'vn';
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = this.vnp.vnp_TmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100; // VNPAY yêu cầu số tiền tính bằng đồng xu
    vnp_Params['vnp_ReturnUrl'] = this.vnp.vnp_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = dayjs(date)
      .add(436, 'minute')
      .format('YYYYMMDDHHmmss');
    console.log('VNP_RETURN_URL = [' + this.vnp.vnp_ReturnUrl + ']');
    console.log('vnp_Params:', vnp_Params);
    vnp_Params = this.sortObject(vnp_Params);

    const querystring = qs;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const cryptoBy = crypto;
    const hmac = cryptoBy.createHmac('sha512', this.vnp.vnp_HashSecret);
    vnp_Params['vnp_SecureHash'] = hmac
      .update(new Buffer(signData, 'utf-8'))
      .digest('hex');
    let vnpUrl = this.vnp.vnp_Url;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return { url: vnpUrl };
  }
  private sortObject(obj: Record<string, any>): Record<string, string> {
    const sorted: Record<string, string> = {};
    const keys: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        keys.push(encodeURIComponent(key));
      }
    }

    keys.sort();

    for (const encodedKey of keys) {
      const decodedKey = decodeURIComponent(encodedKey);
      sorted[encodedKey] = encodeURIComponent(obj[decodedKey]).replace(
        /%20/g,
        '+',
      );
    }

    return sorted;
  }

  async vnpayIpn(query: any): Promise<{ RspCode: string; Message: string }> {
    const vnp_Params = { ...query };
    const secureHash = vnp_Params['vnp_SecureHash'];
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];
    const amount = Number(parseInt(vnp_Params['vnp_Amount'], 10) / 100);

    // Xoá các tham số không dùng để ký
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp lại tham số
    const sortedParams = this.sortObject(vnp_Params);

    const signData = qs.stringify(sortedParams, { encode: false });
    const signed = crypto
      .createHmac('sha512', this.vnp.vnp_HashSecret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    // 1. Kiểm tra checksum
    if (secureHash !== signed) {
      return { RspCode: '97', Message: 'Checksum failed' };
    }
    console.log(orderId);
    // 2. Kiểm tra đơn hàng có tồn tại không
    const order: Order | null = await this.orderRepository.findOne({
      where: { id: Number(orderId) },
    });
    console.log(order);

    if (!order) {
      return { RspCode: '01', Message: 'Order not found' };
    }
    console.log(amount);
    console.log(Number(order.totalPrice));
    console.log(Number(order.totalPrice) === amount);
    // 3. Kiểm tra số tiền
    if (Number(order.totalPrice) !== amount) {
      return { RspCode: '04', Message: 'Amount invalid' };
    }

    // 4. Kiểm tra trạng thái đơn hàng
    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED
    ) {
      return {
        RspCode: '02',
        Message: 'This order has been updated to the payment status',
      };
    }

    // 5. Cập nhật đơn hàng
    if (rspCode === '00') {
      order.status = OrderStatus.COMPLETED;
      console.log(order.status)
    } else {

      order.status = OrderStatus.CANCELLED;
      console.log(order.status)
    }
    await this.orderRepository.save(order);

    const orderItems = await this.orderItemRepository.find({
      where: { order: { id: order.id } },
      relations: ['product'],
    });
    console.log(orderItems);
    await this.productRepository.save(
      orderItems.map(item => {
        const product = item.product;
        product.stock -= item.quantity; // Giảm số lượng tồn kho
        return product;
      }),
    );
    console.log(orderItems);
    const cartProducts = await this.cartProductRepository
      .createQueryBuilder('cartProduct')
      .leftJoin('cartProduct.cart', 'cart')
      .leftJoin('cart.user', 'user')
      .leftJoin('user.orders', 'order')
      .where('order.id = :orderId', { orderId: order.id })
      .getMany();
    console.log(cartProducts);
    const cartProductIds = cartProducts.map(cp => cp.id);

    if (cartProductIds.length > 0) {
      await this.cartProductRepository.delete(cartProductIds);
    }


    // 6. Trả kết quả
    return { RspCode: '00', Message: 'Success' };
  }
}
