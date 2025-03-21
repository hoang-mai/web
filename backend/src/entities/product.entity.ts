import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CartProduct } from "./cart_product.entity";

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

    @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)// one product can be in multiple carts
    cartProducts: CartProduct[];
}
