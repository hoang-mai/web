import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { BaseEntity } from "./base.entity";
import { CartProduct } from "./cart_product.entity";

@Entity("carts")
export class Cart extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.carts)
    user: User;

    @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
    cartProducts: CartProduct[];

    @Column({ default: false })
    isCheckedOut: boolean;
}
