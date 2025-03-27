
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Product } from "./product.entity";
import { User } from "./user.entity";
import { ReviewComment } from "./review_comment.entity";

@Entity('reviews')
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column()
    review: string;

    @Column()
    imageUrl: string;

    @JoinColumn({name: 'product_id'})
    @ManyToOne(() => Product, (product) => product.reviews)
    product: Product;

    @JoinColumn({name: 'user_id'})
    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @OneToMany(() => ReviewComment, (reviewComment) => reviewComment.review)
    reviewComments: ReviewComment[];
}