import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, Unique } from 'typeorm';
import { User } from './User';
import { Plugin } from './Plugin';

export enum PurchaseStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

@Entity('purchases')
@Unique(['userId', 'pluginId'])
@Index(['userId'])
@Index(['pluginId'])
@Index(['status'])
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'plugin_id', type: 'uuid' })
  pluginId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING
  })
  status: PurchaseStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentIntentId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeCustomerId?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.purchases, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Plugin, plugin => plugin.purchases, { onDelete: 'CASCADE' })
  plugin: Plugin;
}