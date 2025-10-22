import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { User } from './User';
import { Plugin } from './Plugin';

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  REFUND = 'REFUND',
  PAYOUT = 'PAYOUT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

@Entity('transactions')
@Index(['userId'])
@Index(['pluginId'])
@Index(['type'])
@Index(['status'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @Column({ name: 'plugin_id', type: 'uuid', nullable: true })
  pluginId?: string;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING
  })
  status: TransactionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  netAmount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeTransactionId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paypalTransactionId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.purchases, { onDelete: 'SET NULL' })
  user?: User;

  @ManyToOne(() => Plugin, plugin => plugin.purchases, { onDelete: 'SET NULL' })
  plugin?: Plugin;
}