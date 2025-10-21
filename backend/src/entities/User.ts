import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, Index } from 'typeorm';
import { Plugin } from './Plugin';
import { Purchase } from './Purchase';
import { Review } from './Review';
import { Session } from './Session';
import { Profile } from './Profile';

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

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => Profile, profile => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Plugin, plugin => plugin.author)
  plugins: Plugin[];

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @OneToMany(() => Session, session => session.user)
  sessions: Session[];
}