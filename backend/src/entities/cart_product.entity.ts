import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity('cart_products')
export class CartProduct extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(() => Cart, (cart) => cart.cartProducts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cartId" })
    cart: Cart;


    @ManyToOne(() => Product, (product) => product.cartProducts)
    @JoinColumn({ name: "productId" })
    product: Product;

    @Column({ type: 'int', default: 1 })
    quantity: number;
}
