import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Plugin } from './Plugin';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ default: false })
  isRefunded: boolean;

  @Column({ nullable: true })
  refundedAt?: Date;

  @CreateDateColumn()
  purchasedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.purchases)
  user: User;

  @ManyToOne(() => Plugin, plugin => plugin.purchases)
  plugin: Plugin;
}