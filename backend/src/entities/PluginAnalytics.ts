import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, Unique } from 'typeorm';
import { Plugin } from './Plugin';

@Entity('plugin_analytics')
@Unique(['pluginId', 'date'])
@Index(['pluginId'])
@Index(['date'])
export class PluginAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plugin_id', type: 'uuid' })
  pluginId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'integer', default: 0 })
  downloads: number;

  @Column({ type: 'integer', default: 0 })
  views: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'integer', default: 0 })
  uniqueVisitors: number;

  @Column({ type: 'integer', default: 0 })
  addToCartCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  conversionRate: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Plugin, plugin => plugin.analytics, { onDelete: 'CASCADE' })
  plugin: Plugin;
}