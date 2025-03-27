import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Order } from "./order.entity";
import { Product } from "./product.entity";

@Entity('order_items')
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn({name: 'order_id'})
    @ManyToOne(() => Order, (order) => order.orderItems,{onDelete: 'CASCADE'})
    order: Order;

    @JoinColumn({name: 'product_id'})
    @ManyToOne(() => Product, (product) => product.orderItems)
    product: Product;

    @Column()
    quantity: number;
}