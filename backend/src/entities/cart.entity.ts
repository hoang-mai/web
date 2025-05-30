import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { CartProduct } from './cart_product.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  cartProducts: CartProduct[];

  @Column({ default: false })
  isCheckedOut: boolean;
}
