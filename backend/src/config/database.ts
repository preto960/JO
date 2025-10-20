import { DataSource } from 'typeorm';
import { User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction } from '@/entities';
import config from './index';

// Parse DATABASE_URL if provided, otherwise use individual variables
const databaseUrl = config.database.url;
console.log('🔗 DATABASE_URL found:', databaseUrl ? 'YES' : 'NO');
console.log('🔗 NODE_ENV:', config.nodeEnv);

let dataSourceConfig: any;

if (databaseUrl) {
  // Use DATABASE_URL (Vercel Storage format)
  console.log('🌐 Using DATABASE_URL configuration');
  dataSourceConfig = {
    type: 'postgres',
    url: databaseUrl,
    entities: [User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction],
    synchronize: config.database.synchronize,
    logging: config.database.logging,
    ssl: { rejectUnauthorized: false }, // Always use SSL for external databases
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
  };
} else {
  // Use individual variables (localhost development)
  console.log('🏠 Using localhost configuration');
  dataSourceConfig = {
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    entities: [User, Plugin, Session, Purchase, Review, PluginAnalytics, Transaction],
    synchronize: config.database.synchronize,
    logging: config.database.logging,
    ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
  };
}

export const AppDataSource = new DataSource(dataSourceConfig);
export default AppDataSource;