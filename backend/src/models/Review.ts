import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Plugin } from './Plugin';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  isVerifiedPurchase: boolean;

  @Column({ nullable: true })
  response?: string;

  @Column({ nullable: true })
  respondedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @ManyToOne(() => Plugin, plugin => plugin.reviews)
  plugin: Plugin;
}