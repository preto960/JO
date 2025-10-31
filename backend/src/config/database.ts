import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Plugin } from '../models/Plugin';
import { Review } from '../models/Review';
import { Download } from '../models/Download';
import { Purchase } from '../models/Purchase';
import { InstalledPlugin } from '../models/InstalledPlugin';
import { Permission } from '../models/Permission';
import { Setting } from '../models/Setting';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Plugin, Review, Download, Purchase, InstalledPlugin, Permission, Setting],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});