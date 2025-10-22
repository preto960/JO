import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    url: string;
    synchronize: boolean;
    logging: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || '',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  },
};

// Validation
if (!config.database.url) {
  throw new Error('DATABASE_URL is required in all environments');
}

if (!config.jwt.secret || config.jwt.secret === 'your-super-secret-jwt-key-change-this-in-production') {
  if (config.nodeEnv === 'production') {
    throw new Error('JWT_SECRET is required in production');
  } else {
    console.warn('⚠️  Using default JWT secret. Please set JWT_SECRET in production.');
  }
}

console.log('🔧 Configuration loaded:', {
  port: config.port,
  nodeEnv: config.nodeEnv,
  databaseUrl: 'CONFIGURED',
  jwtSecret: config.jwt.secret ? 'CONFIGURED' : 'MISSING',
  corsOrigin: config.cors.origin,
});

export default config;