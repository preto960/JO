import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Review } from './Review';
import { Download } from './Download';
import { Purchase } from './Purchase';

export enum PluginStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PluginCategory {
  PRODUCTIVITY = 'PRODUCTIVITY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  EDUCATION = 'EDUCATION',
  BUSINESS = 'BUSINESS',
  DEVELOPMENT = 'DEVELOPMENT',
  DESIGN = 'DESIGN',
  MARKETING = 'MARKETING',
  ANALYTICS = 'ANALYTICS',
  SOCIAL = 'SOCIAL',
  UTILITY = 'UTILITY'
}

@Entity('plugins')
export class Plugin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column({ type: 'text', nullable: true })
  longDescription?: string;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  price: number;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  icon?: string;

  @Column({ type: 'simple-array', nullable: true })
  screenshots?: string[];

  @Column({ nullable: true })
  documentationUrl?: string;

  @Column({ nullable: true })
  supportUrl?: string;

  @Column({ nullable: true })
  demoUrl?: string;

  @Column({ nullable: true })
  repositoryUrl?: string;

  @Column({
    type: 'enum',
    enum: PluginStatus,
    default: PluginStatus.DRAFT
  })
  status: PluginStatus;

  @Column({
    type: 'enum',
    enum: PluginCategory
  })
  category: PluginCategory;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'jsonb', nullable: true })
  aiAnalysis?: any;

  @Column({ type: 'jsonb', nullable: true })
  seoMetadata?: any;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  featuredAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.plugins)
  developer: User;

  @OneToMany(() => Review, review => review.plugin)
  reviews: Review[];

  @OneToMany(() => Download, download => download.plugin)
  downloads: Download[];

  @OneToMany(() => Purchase, purchase => purchase.plugin)
  purchases: Purchase[];
}