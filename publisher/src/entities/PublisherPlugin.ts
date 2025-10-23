import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { PublisherUser } from './PublisherUser';
import { PublisherAnalytics } from './PublisherAnalytics';

export enum PublisherPluginStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity('publisher_plugins')
@Index(['authorId'])
@Index(['status'])
@Index(['category'])
export class PublisherPlugin {
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
    enum: PublisherPluginStatus,
    default: PublisherPluginStatus.DRAFT
  })
  status: PublisherPluginStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  downloadCount: number;

  @Column({ type: 'integer', default: 0 })
  viewCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign Keys
  @Column({ name: 'author_id', nullable: true })
  authorId?: string;

  // Relations
  @ManyToOne(() => PublisherUser, user => user.plugins, { onDelete: 'CASCADE', nullable: true })
  author?: PublisherUser;

  @OneToMany(() => PublisherAnalytics, analytics => analytics.plugin)
  analytics: PublisherAnalytics[];
}