import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.enum';
import { Cart } from './cart.entity';
import { SearchHistory } from './search_history.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { ReviewComment } from './review_comment.entity';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { Post } from './post.entity';
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  phone: string;



  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  address: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToOne(() => SearchHistory, (searchHistory) => searchHistory.user)
  searchHistory: SearchHistory;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => ReviewComment, (reviewComment) => reviewComment.user)
  reviewComments: ReviewComment[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];


  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

}
