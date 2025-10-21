import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { User } from './User';
import { Purchase } from './Purchase';
import { Review } from './Review';
import { PluginAnalytics } from './PluginAnalytics';

export enum PluginStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity('plugins')
@Index(['authorId'])
@Index(['status'])
@Index(['category'])
export class Plugin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: '1.0.0' })
  version: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  downloadUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  demoUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  githubUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentationUrl?: string;

  @Column({ type: 'text', nullable: true })
  changelog?: string;

  @Column({
    type: 'enum',
    enum: PluginStatus,
    default: PluginStatus.DRAFT
  })
  status: PluginStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  downloadCount: number;

  @Column({ type: 'integer', default: 0 })
  viewCount: number;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign Keys
  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  // Relations
  @ManyToOne(() => User, user => user.plugins, { onDelete: 'CASCADE' })
  author: User;

  @OneToMany(() => Purchase, purchase => purchase.plugin)
  purchases: Purchase[];

  @OneToMany(() => Review, review => review.plugin)
  reviews: Review[];

  @OneToMany(() => PluginAnalytics, analytics => analytics.plugin)
  analytics: PluginAnalytics[];
}