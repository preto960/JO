import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, Unique } from 'typeorm';
import { User } from './User';
import { Plugin } from './Plugin';

@Entity('reviews')
@Unique(['userId', 'pluginId'])
@Index(['userId'])
@Index(['pluginId'])
@Index(['rating'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'plugin_id', type: 'uuid' })
  pluginId: string;

  @Column({ type: 'integer' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'boolean', default: true })
  isVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'integer', default: 0 })
  helpfulCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Plugin, plugin => plugin.reviews, { onDelete: 'CASCADE' })
  plugin: Plugin;
}