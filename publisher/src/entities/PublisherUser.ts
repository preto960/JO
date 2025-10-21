import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { PublisherPlugin } from './PublisherPlugin';
import { PublisherSession } from './PublisherSession';

export enum PublisherRole {
  DEVELOPER = 'DEVELOPER',
  ADMIN = 'ADMIN'
}

@Entity('publisher_users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class PublisherUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: PublisherRole,
    default: PublisherRole.DEVELOPER
  })
  role: PublisherRole;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  github?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paypalEmail?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeAccountId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingEarnings: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => PublisherPlugin, plugin => plugin.author)
  plugins: PublisherPlugin[];

  @OneToMany(() => PublisherSession, session => session.user)
  sessions: PublisherSession[];
}