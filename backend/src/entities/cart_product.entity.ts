import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity('cart_products')
export class CartProduct {
    @PrimaryGeneratedColumn()
    id: number;

    // A cart can have many cartProducts, but a cartProduct belongs to one cart
    @ManyToOne(() => Cart, (cart) => cart.cartProducts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cartId" })
    cart: Cart;

    // Each cartProduct must relate to one product
    @ManyToOne(() => Product, (product) => product.cartProducts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "productId" })
    product: Product;

    // Quantity with a default value of 1
    @Column({ type: 'int', default: 1 })
    quantity: number;
}
