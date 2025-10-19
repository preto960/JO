import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';

const DB_PATH = './data/publisher.db';

export interface Publisher {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  publisherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Download {
  id: string;
  pluginId: string;
  createdAt: string;
}

let db: sqlite3.Database;

export async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log('📦 Connected to SQLite database');
      
      // Create tables
      db.serialize(() => {
        // Publishers table
        db.run(`
          CREATE TABLE IF NOT EXISTS publishers (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Plugins table
        db.run(`
          CREATE TABLE IF NOT EXISTS plugins (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            version TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            publisherId TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (publisherId) REFERENCES publishers (id)
          )
        `);

        // Downloads table
        db.run(`
          CREATE TABLE IF NOT EXISTS downloads (
            id TEXT PRIMARY KEY,
            pluginId TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pluginId) REFERENCES plugins (id)
          )
        `);

        // Create default publisher
        createDefaultPublisher();
      });
      
      resolve();
    });
  });
}

async function createDefaultPublisher(): Promise<void> {
  const run = promisify(db.run.bind(db));
  const get = promisify(db.get.bind(db));
  
  try {
    const existingPublisher = await get('SELECT * FROM publishers WHERE email = ?', ['publisher@example.com']);
    
    if (!existingPublisher) {
      const hashedPassword = await bcrypt.hash('publisher123', 10);
      const publisherId = `pub_${Date.now()}`;
      
      await run(
        'INSERT INTO publishers (id, email, name, password) VALUES (?, ?, ?, ?)',
        [publisherId, 'publisher@example.com', 'Demo Publisher', hashedPassword]
      );
      
      console.log('✅ Created default publisher: publisher@example.com / publisher123');
    }
  } catch (error) {
    console.error('❌ Error creating default publisher:', error);
  }
}

export function getDatabase(): sqlite3.Database {
  return db;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const all = promisify(db.all.bind(db));
  return all(sql, params);
}

export async function get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const get = promisify(db.get.bind(db));
  return get(sql, params);
}

export async function run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
  const run = promisify(db.run.bind(db));
  return run(sql, params);
}