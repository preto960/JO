import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { PublisherPlugin } from './PublisherPlugin';

@Entity('publisher_analytics')
@Index(['pluginId'])
@Index(['date'])
export class PublisherAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', default: 0 })
  views: number;

  @Column({ type: 'integer', default: 0 })
  downloads: number;

  @Column({ type: 'integer', default: 0 })
  purchases: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Foreign Keys
  @Column({ name: 'plugin_id' })
  pluginId: string;

  // Relations
  @ManyToOne(() => PublisherPlugin, plugin => plugin.analytics, { onDelete: 'CASCADE' })
  plugin: PublisherPlugin;
}