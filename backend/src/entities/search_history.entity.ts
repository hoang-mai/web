import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('search_histories')
export class SearchHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

    @OneToOne(() => User, (user) => user.searchHistory)
    @JoinColumn({ name: 'user_id' })
    user: User;
    
    @Column()
    searchQuery: string;
    
}
