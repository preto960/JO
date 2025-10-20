import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { PublisherUser } from './PublisherUser';
import { PublisherPlugin } from './PublisherPlugin';

@Entity('publisher_sessions')
@Index(['userId'])
@Index(['token'])
export class PublisherSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Foreign Keys
  @Column({ name: 'user_id' })
  userId: string;

  // Relations
  @ManyToOne(() => PublisherUser, user => user.sessions, { onDelete: 'CASCADE' })
  user: PublisherUser;
}