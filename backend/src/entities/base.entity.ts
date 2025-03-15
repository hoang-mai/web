import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class BaseEntity {
    
    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}