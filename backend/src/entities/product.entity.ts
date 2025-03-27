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

    @Column()
    name: string;

    @Column("decimal")
    price: number;

    @Column({ default: 0 })
    stock: number;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column()
    totalRating: number;

    @Column({ default: false })
    isDeleted: boolean;

    @Column()
    discount: number;

    @Column({type:'enum', enum: Category})
    category: Category;

    @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
    cartProducts: CartProduct[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];
}
