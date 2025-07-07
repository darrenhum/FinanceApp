import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  account_id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  merchant: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  @Column({ type: 'uuid' })
  added_by_user_id: string;

  @Column({ type: 'uuid', nullable: true })
  owner_user_id: string;

  @Column({ type: 'uuid', nullable: true })
  card_id: string;

  // Relationships
  @ManyToOne(() => Account, { nullable: false })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by_user_id' })
  added_by_user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_user_id' })
  owner_user: User;

  // Note: card_id relationship would be with a Card entity (not yet implemented)
  // @ManyToOne(() => Card, { nullable: true })
  // @JoinColumn({ name: 'card_id' })
  // card: Card;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
