import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PublishedPlugin } from './PublishedPlugin';

export enum DeveloperRole {
  DEVELOPER = 'DEVELOPER',
  ADMIN = 'ADMIN'
}

@Entity('developers')
export class Developer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  github?: string;

  @Column({ nullable: true })
  twitter?: string;

  @Column({
    type: 'enum',
    enum: DeveloperRole,
    default: DeveloperRole.DEVELOPER
  })
  role: DeveloperRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => PublishedPlugin, plugin => plugin.developer)
  plugins: PublishedPlugin[];
}

