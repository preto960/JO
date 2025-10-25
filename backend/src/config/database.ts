import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Plugin } from '../models/Plugin';
import { Review } from '../models/Review';
import { Download } from '../models/Download';
import { Purchase } from '../models/Purchase';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ai_plugin_marketplace',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Plugin, Review, Download, Purchase],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});