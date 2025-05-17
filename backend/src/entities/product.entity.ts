
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CartProduct } from "./cart_product.entity";
import { OrderItem } from "./order_item.entity";
import { Review } from "./review.entity";
import { Category } from "./category.enum";

@Entity("products")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('decimal')
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({
    default: false,
    type: 'tinyint',
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => value === 1,
    },
  })
  isDeleted: boolean;

  @Column({ nullable: true })
  discount: number;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cartProducts: CartProduct[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
