import { DataSource } from 'typeorm';
import { User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction } from '@/entities';
import config from './index';

// Always use DATABASE_URL
const databaseUrl = config.database.url;
console.log('🔗 DATABASE_URL found:', databaseUrl ? 'YES' : 'NO');
console.log('🔗 NODE_ENV:', config.nodeEnv);

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Please set it in your environment variables.');
}

// Always use DATABASE_URL configuration
console.log('🌐 Using DATABASE_URL configuration');
const dataSourceConfig = {
  type: 'postgres',
  url: databaseUrl,
  entities: [User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction],
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  ssl: { rejectUnauthorized: false }, // Always use SSL for external databases
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
};

export const AppDataSource = new DataSource(dataSourceConfig);
export default AppDataSource;