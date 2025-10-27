import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Developer } from './Developer';

export enum PluginStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
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

@Entity('published_plugins')
export class PublishedPlugin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @Column({ type: 'text', nullable: true })
  longDescription?: string;

  @Column()
  version: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
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

  // Blob storage URL for the plugin package
  @Column({ nullable: true })
  packageUrl?: string;

  @Column({ nullable: true })
  packageSize?: number; // in bytes

  // Plugin manifest data
  @Column({ type: 'jsonb', nullable: true })
  manifest?: any;

  @Column({ type: 'jsonb', nullable: true })
  seoMetadata?: any;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  featuredAt?: Date;

  @Column({ nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Developer, developer => developer.plugins)
  developer: Developer;
}

