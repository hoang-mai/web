import { Entity, Column, PrimaryGeneratedColumn,OneToMany} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.enum';
import { Cart } from './cart.entity';

@Entity()
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

    @Column({type: 'enum', enum: Role, default: Role.USER})
    role: Role;

    @Column({ nullable: true })
    phone: string;

    @OneToMany(() => Cart, (cart) => cart.user)
    carts: Cart[];
}
