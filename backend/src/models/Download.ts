import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Plugin } from './Plugin';

@Entity('downloads')
export class Download {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  version: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  downloadedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Plugin, plugin => plugin.downloads)
  plugin: Plugin;
}