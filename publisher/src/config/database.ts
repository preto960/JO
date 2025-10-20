import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PublisherUser, PublisherPlugin, PublisherSession, PublisherAnalytics } from '../entities';

// Load environment variables
dotenv.config();

// Parse DATABASE_URL if provided, otherwise use individual variables
const databaseUrl = process.env.DATABASE_URL;
console.log('🔗 DATABASE_URL found:', databaseUrl ? 'YES' : 'NO');
console.log('🔗 NODE_ENV:', process.env.NODE_ENV);

let dataSourceConfig: any;

if (databaseUrl) {
  // Use DATABASE_URL (Vercel Storage format)
  console.log('🌐 Using DATABASE_URL configuration');
  dataSourceConfig = {
    type: 'postgres',
    url: databaseUrl,
    entities: [PublisherUser, PublisherPlugin, PublisherSession, PublisherAnalytics],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: { rejectUnauthorized: false }, // Always use SSL for external databases
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
  };
} else {
  // Use individual variables (localhost development)
  console.log('🏠 Using localhost configuration');
  dataSourceConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'publisher_db',
    entities: [PublisherUser, PublisherPlugin, PublisherSession, PublisherAnalytics],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
  };
}

export const PublisherDataSource = new DataSource(dataSourceConfig);
export default PublisherDataSource;