import { DataSource } from 'typeorm';
import { User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction, Profile } from '@/entities';
import config from './index';

// Always use DATABASE_URL
const databaseUrl = config.database.url;
console.log('🔗 DATABASE_URL found:', databaseUrl ? 'YES' : 'NO');
console.log('🔗 NODE_ENV:', config.nodeEnv);

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Please set it in your environment variables.');
}

// Always use PostgreSQL configuration with Neon
console.log('🌐 Using PostgreSQL configuration (Neon)');
const dataSourceConfig = {
  type: 'postgres' as const,
  url: databaseUrl,
  entities: [User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction, Profile],
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  ssl: { rejectUnauthorized: false }, // Required for Neon
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
};

export const AppDataSource = new DataSource(dataSourceConfig);
export default AppDataSource;