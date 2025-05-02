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
        price: 999.99,
        stock: 50,
        description: 'Latest iPhone with advanced features',
        imageUrl: 'https://example.com/iphone15.jpg',
        totalRating: 4.5,
        discount: 5,
        category: Category.MOBILE,
      },
      {
        name: 'MacBook Pro M3',
        price: 1999.99,
        stock: 30,
        description: 'Powerful laptop for professionals',
        imageUrl: 'https://example.com/macbook.jpg',
        totalRating: 4.8,
        discount: 10,
        category: Category.LAPTOP,
      },
      {
        name: 'iPad Pro 13"',
        price: 799.99,
        stock: 40,
        description: 'Premium tablet with Apple Pencil support',
        imageUrl: 'https://example.com/ipad.jpg',
        totalRating: 4.6,
        discount: 0,
        category: Category.TABLET,
      },
      {
        name: 'Samsung Galaxy S23',
        price: 899.99,
        stock: 45,
        description: 'Feature-rich Android smartphone',
        imageUrl: 'https://example.com/galaxy.jpg',
        totalRating: 4.4,
        discount: 15,
        category: Category.MOBILE,
      },
      {
        name: 'Dell XPS 15',
        price: 1599.99,
        stock: 25,
        description: 'Premium Windows laptop',
        imageUrl: 'https://example.com/dell.jpg',
        totalRating: 4.3,
        discount: 8,
        category: Category.LAPTOP,
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
        status: OrderStatus.PENDING,
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
