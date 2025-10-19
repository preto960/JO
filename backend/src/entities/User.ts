import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Plugin } from './Plugin';
import { Purchase } from './Purchase';
import { Review } from './Review';
import { Session } from './Session';

export enum UserRole {
  USER = 'USER',
  DEVELOPER = 'DEVELOPER',
  ADMIN = 'ADMIN'
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
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
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

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

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Plugin, plugin => plugin.author)
  plugins: Plugin[];

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @OneToMany(() => Session, session => session.user)
  sessions: Session[];
}