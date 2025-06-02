import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Cart } from '../entities/cart.entity';
import { Category } from '../entities/category.enum';
import { Role } from '../entities/role.enum';
import { CartProduct } from '../entities/cart_product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order_item.entity';
import { OrderStatus } from '../entities/order_status.enum';
import { Review } from '../entities/review.entity';
import { ReviewComment } from '../entities/review_comment.entity';
import { SearchHistory } from '../entities/search_history.entity';
import { Post } from '../entities/post.entity';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewComment)
    private readonly reviewCommentRepository: Repository<ReviewComment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepository: Repository<SearchHistory>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async seed() {
    // Clear database tables in reverse order of dependency
    await this.messageRepository.delete({});
    await this.chatRepository.delete({});
    await this.reviewCommentRepository.delete({});
    await this.reviewRepository.delete({});
    await this.orderItemRepository.delete({});
    await this.orderRepository.delete({});
    await this.cartProductRepository.delete({});
    await this.cartRepository.delete({});
    await this.searchHistoryRepository.delete({});
    await this.postRepository.delete({});
    await this.productRepository.delete({});
    await this.userRepository.delete({});

    console.log('Database cleared, seeding started...');

    // Seed users
    const users = await this.seedUsers();

    // Seed products
    const products = await this.seedProducts();

    // Seed carts for users
    const carts = await this.seedCarts(users);

    // Seed cart products
    await this.seedCartProducts(carts, products);

    // Seed orders
    const orders = await this.seedOrders(users);

    // Seed order items
    await this.seedOrderItems(orders, products);

    // Seed reviews
    const reviews = await this.seedReviews(users, products);

    // Seed review comments
    await this.seedReviewComments(users, reviews);

    // Seed posts
    const adminUser = users.find((user) => user.role === Role.ADMIN);
    if (adminUser) {
      await this.seedPosts(adminUser);
    } else {
      console.log('No admin user found, skipping posts seeding');
    }

    // Seed search history
    await this.seedSearchHistory(users);

    // Seed chats
    const chats = await this.seedChats(users);

    // Seed messages
    await this.seedMessages(chats, users);

    console.log('Database seeding completed successfully!');
  }

  private async seedUsers(): Promise<User[]> {
    console.log('Seeding users...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await this.userRepository.save([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: Role.ADMIN,
        phone: '1234567890',
        address: '123 Admin St, City',
        imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: Role.USER,
        phone: '0987654321',
        address: '456 User St, City',
        imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: Role.USER,
        phone: '5556667777',
        address: '789 User Ave, City',
        imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
    ]);

    console.log(`${users.length} users seeded`);
    return users;
  }

  private async seedProducts(): Promise<Product[]> {
    console.log('Seeding products...');

    const products = await this.productRepository.save([
      {
        name: 'iPhone 15 Pro',
        price: 21000000,
        stock: 50,
        description: 'Latest iPhone with advanced features',
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/303833/iphone-15-pro-blue-thumbnew-600x600.jpg',
        discount: 5,
        category: Category.MOBILE,
      },
      {
        name: 'MacBook Pro M3',
        price: 25000000,
        stock: 30,
        description: 'Powerful laptop for professionals',
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/44/327690/macbook-pro-16-inch-m3-max-64gb-1tb-40gpu-den-thumb-600x600.jpg',
        discount: 10,
        category: Category.LAPTOP,
      },
      {
        name: 'iPad Pro 13"',
        price: 17000000,
        stock: 40,
        description: 'Premium tablet with Apple Pencil support',
        imageUrl: 'https://cdnv2.tgdd.vn/mwg-static/common/News/1575647/thumb%20ipad%20air%20M3.jpg',
        discount: 0,
        category: Category.TABLET,
      },
      {
        name: 'Samsung Galaxy S23',
        price: 234000000,
        stock: 45,
        description: 'Feature-rich Android smartphone',
        imageUrl: 'https://cdn.xtmobile.vn/vnt_upload/product/10_2023/thumbs/(600x600)_crop_samsung-galaxy-s23-fe-xtmobile.png',
        discount: 15,
        category: Category.MOBILE,
      },
      {
        name: 'Dell XPS 15',
        price: 17999000,
        stock: 25,
        description: 'Premium Windows laptop',
        imageUrl: 'https://mayinlaser.vn/wp-content/uploads/2021/07/XPS-15_left-angle-open.jpg',
        discount: 8,
        category: Category.LAPTOP,
      },
      {
        name: 'Apple Watch Series 9',
        price: 3999000,
        stock: 60,
        description: 'Smartwatch with health tracking features',
        imageUrl: 'https://product.hstatic.net/200000850199/product/3_cae3c290c1304ada9b5dbb1c72748027_4a963c3f875a44c9b0aa57d35edf4c86.jpg',
        discount: 0,
        category: Category.LAPTOP,
      },
      {
        name: 'Sony WH-1000XM5',
        price: 350000000,
        stock: 70,
        description: 'Noise-canceling headphones',
        imageUrl: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/313694/tai-nghe-bluetooth-chup-tai-sony-wh-ch520-210425-043507-151-600x600.jpg',
        discount: 5,
        category: Category.MOBILE,
      },
      {
        name: 'Apple AirPods Pro 2nd Gen',
        price: 2500000,
        stock: 80,
        description: 'Wireless earbuds with noise cancellation',
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/54/315014/tai-nghe-bluetooth-airpods-pro-2nd-gen-usb-c-charge-apple-thumb-1-600x600.jpg',
        discount: 0,
        category: Category.MOBILE,
      },
      {
        name: 'Samsung Galaxy Tab S9',
        price: 7999000,
        stock: 35,
        description: 'High-performance Android tablet',
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/522/303299/TimerThumb/samsung-galaxy-tab-s9-(68).jpg',
        discount: 10,
        category: Category.TABLET,
      },
      {
        name: 'Microsoft Surface Pro 9',
        price: 14990000,
        stock: 20,
        description: 'Versatile 2-in-1 laptop/tablet',
        imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/76957/microsoft-surface-phone-300x300.jpg',
        discount: 5,
        category: Category.LAPTOP,
      },
      {
        name: 'Google Pixel Buds Pro',
        price: 1399000,
        stock: 90,
        description: 'Wireless earbuds with Google Assistant',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT6VMinTsUNF-oa8oFgDeS6LDKzuhaUv8UurzlVF9LtcpvJZJwARURaJAbz_HvJTN3T1YFNTyhG9TAPA7FwFbNy8la5Kd6UHMo7YQoNzLclhwFgKHpLpB5JR8l4x-9Al2xO7_YG9Ks&usqp=CAc',
        discount: 0,
        category: Category.MOBILE,
      },
      {
        name: 'Fitbit Charge 5',
        price: 14999000,
        stock: 100,
        description: 'Fitness tracker with heart rate monitor',
        imageUrl: 'https://chiaki.vn/upload/product/2024/08/dong-ho-thong-minh-fitbit-charge-5-xanh-p120917-66bdb892a5e58-15082024151306.png',
        discount: 0,
        category: Category.LAPTOP,
      },
      {
        name: 'Razer Blade 15',
        price: 24999000,
        stock: 15,
        description: 'Gaming laptop with high performance',
        imageUrl: 'https://static.hungphatlaptop.com/wp-content/uploads/2021/07/Razer-Blade-15-Advanced-Model-2021-H1.jpeg',
        discount: 20,
        category: Category.LAPTOP,
      },
      {
        name: 'Oculus Quest 3',
        price: 5499000,
        stock: 50,
        description: 'Virtual reality headset',
        imageUrl: 'https://product.hstatic.net/200000255149/product/20006782_12ff42e55def41dda5c83d22affa31c2_master.jpg',
        discount: 0,
        category: Category.MOBILE,
      },
      {
        name: 'Logitech MX Master 3S',
        price: 799000,
        stock: 120,
        description: 'Wireless mouse with ergonomic design',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI2K3_eNl-dx-elGLLszWk-3ELU-nb9P2KJg&s',
        discount: 0,
        category: Category.MOBILE,
      },
      {
        name: 'Anker PowerCore 26800',
        price: 349000,
        stock: 200,
        description: 'Portable charger with high capacity',
        imageUrl: 'https://chiaki.vn/upload/product/2022/07/sac-du-phong-anker-powercore-26800-power-delivery-a1375-62c25d20886be-04072022102312.png',
        discount: 0,
        category: Category.MOBILE,
      },
      {
        name: 'Bose QuietComfort 45',
        price: 329000,
        stock: 40,
        description: 'Noise-canceling headphones with superior sound quality',
        imageUrl: 'https://product.hstatic.net/200000409445/product/qc-45-trang_4bf86b14c70541a0b5a79db47bd9300e_master.jpg',
        discount: 0,
        category: Category.MOBILE,
      },
    ]);

    console.log(`${products.length} products seeded`);
    return products;
  }

  private async seedCarts(users: User[]): Promise<Cart[]> {
    console.log('Seeding carts...');

    const carts = await this.cartRepository.save(
      users.map((user) => ({
        user,
        isCheckedOut: false,
      })),
    );

    console.log(`${carts.length} carts seeded`);
    return carts;
  }

  private async seedCartProducts(
    carts: Cart[],
    products: Product[],
  ): Promise<CartProduct[]> {
    console.log('Seeding cart products...');

    const cartProducts = await this.cartProductRepository.save([
      {
        cart: carts[1], // John's cart
        product: products[0], // iPhone 15 Pro
        quantity: 1,
      },
      {
        cart: carts[1], // John's cart
        product: products[2], // iPad Pro
        quantity: 2,
      },
      {
        cart: carts[2], // Jane's cart
        product: products[1], // MacBook Pro
        quantity: 1,
      },
    ]);

    console.log(`${cartProducts.length} cart products seeded`);
    return cartProducts;
  }

  private async seedOrders(users: User[]): Promise<Order[]> {
    console.log('Seeding orders...');

    const orders = await this.orderRepository.save([
      {
        user: users[1], // John
        totalPrice: 1599.98, // 1x iPhone + 1x iPad
        status: OrderStatus.DELIVERED,
      },
      {
        user: users[1], // John
        totalPrice: 899.99, // 1x Samsung Galaxy
        status: OrderStatus.SHIPPING,
      },
      {
        user: users[2], // Jane
        totalPrice: 1999.99, // 1x MacBook Pro
        status: OrderStatus.SHIPPING,
      },
    ]);

    console.log(`${orders.length} orders seeded`);
    return orders;
  }

  private async seedOrderItems(
    orders: Order[],
    products: Product[],
  ): Promise<OrderItem[]> {
    console.log('Seeding order items...');

    const orderItems = await this.orderItemRepository.save([
      {
        order: orders[0], // John's first order
        product: products[0], // iPhone 15 Pro
        price: 999.99,
        quantity: 1,
      },
      {
        order: orders[0], // John's first order
        product: products[2], // iPad Pro
        price: 599.99, // Discounted price
        quantity: 1,
      },
      {
        order: orders[1], // John's second order
        product: products[3], // Samsung Galaxy
        price: 899.99,
        quantity: 1,
      },
      {
        order: orders[2], // Jane's order
        product: products[1], // MacBook Pro
        price: 1999.99,
        quantity: 1,
      },
    ]);

    console.log(`${orderItems.length} order items seeded`);
    return orderItems;
  }

  private async seedReviews(
    users: User[],
    products: Product[],
  ): Promise<Review[]> {
    console.log('Seeding reviews...');

    const reviews = await this.reviewRepository.save([
      {
        user: users[1], // John
        product: products[0], // iPhone 15 Pro
        rating: 5,
        review: 'Amazing product, I love the camera features!',
        imageUrl: 'https://example.com/review-photo1.jpg',
      },
      {
        user: users[2], // Jane
        product: products[1], // MacBook Pro
        rating: 4,
        review: 'Great laptop, very fast but battery life could be better.',
        imageUrl: '',
      },
      {
        user: users[1], // John
        product: products[2], // iPad Pro
        rating: 5,
        review: 'Perfect for drawing and note-taking.',
        imageUrl: 'https://example.com/review-photo2.jpg',
      },
    ]);

    console.log(`${reviews.length} reviews seeded`);
    return reviews;
  }

  private async seedReviewComments(
    users: User[],
    reviews: Review[],
  ): Promise<ReviewComment[]> {
    console.log('Seeding review comments...');

    const firstComment = await this.reviewCommentRepository.save({
      user: users[2], // Jane
      review: reviews[0], // John's iPhone review
      comment: 'I agree, the camera is incredible!',
      imageUrl: '',
      likeCount: 2,
      reported: false,
    });

    const comments = await this.reviewCommentRepository.save([
      {
        user: users[1], // John
        review: reviews[1], // Jane's MacBook review
        comment: 'Try adjusting your screen brightness to save battery.',
        imageUrl: '',
        likeCount: 1,
        reported: false,
      },
      {
        user: users[0], // Admin
        review: reviews[2], // John's iPad review
        comment: 'Thanks for sharing your experience!',
        imageUrl: '',
        likeCount: 3,
        reported: false,
      },
      {
        user: users[1], // John
        review: reviews[0], // John's iPhone review
        comment: 'Thanks for the feedback!',
        imageUrl: '',
        likeCount: 1,
        reported: false,
        parent: firstComment, // Reply to Jane's comment
      },
    ]);

    console.log(`${comments.length + 1} review comments seeded`);
    return [firstComment, ...comments];
  }

  private async seedPosts(admin: User): Promise<Post[]> {
    console.log('Seeding posts...');

    const posts = await this.postRepository.save([
      {
        title: 'Welcome to our online store!',
        description:
          'We are excited to announce our new products arriving next week.',
        author: admin,
      },
      {
        title: 'Summer Sale Coming Soon',
        description:
          'Get ready for amazing discounts on all electronics this summer!',
        author: admin,
      },
      {
        title: 'Tips for choosing the right smartphone',
        description:
          'Here are some expert tips to help you choose the perfect smartphone for your needs.',
        author: admin,
      },
    ]);

    console.log(`${posts.length} posts seeded`);
    return posts;
  }

  private async seedSearchHistory(users: User[]): Promise<SearchHistory[]> {
    console.log('Seeding search history...');

    const searchHistories = await this.searchHistoryRepository.save([
      {
        user: users[1], // John
        searchQuery: 'iPhone 15',
      },
      {
        user: users[2], // Jane
        searchQuery: 'MacBook Pro',
      },
    ]);

    console.log(`${searchHistories.length} search histories seeded`);
    return searchHistories;
  }

  private async seedChats(users: User[]): Promise<Chat[]> {
    console.log('Seeding chats...');

    const chats = await this.chatRepository.save([
      {
        user: users[1], // John
        admin: users[0], // Admin
        isUserDeleted: false,
        isAdminDeleted: false,
      },
      {
        user: users[2], // Jane
        admin: users[0], // Admin
        isUserDeleted: false,
        isAdminDeleted: false,
      },
    ]);

    console.log(`${chats.length} chats seeded`);
    return chats;
  }

  private async seedMessages(chats: Chat[], users: User[]): Promise<Message[]> {
    console.log('Seeding messages...');

    const messages = await this.messageRepository.save([
      {
        chat: chats[0], // John's chat
        sender: users[1], // John
        message: 'Hello, I have a question about my order.',
        isRevoked: false,
      },
      {
        chat: chats[0], // John's chat
        sender: users[0], // Admin
        message: "Hi John, I'd be happy to help. What's your order number?",
        isRevoked: false,
      },
      {
        chat: chats[0], // John's chat
        sender: users[1], // John
        message: "It's #12345, I was wondering about the delivery date.",
        isRevoked: false,
      },
      {
        chat: chats[1], // Jane's chat
        sender: users[2], // Jane
        message: 'I need help with my MacBook Pro purchase.',
        isRevoked: false,
      },
      {
        chat: chats[1], // Jane's chat
        sender: users[0], // Admin
        message: 'Hi Jane, I can assist you. What seems to be the issue?',
        isRevoked: false,
      },
    ]);

    console.log(`${messages.length} messages seeded`);
    return messages;
  }
}
