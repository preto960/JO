import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'reflect-metadata';

// Import configurations
import config from './config';
import { AppDataSource } from './config/database';

// Import routes
import authRoutes from './routes/auth';
import pluginRoutes from './routes/plugins';
import userRoutes from './routes/users';
import analyticsRoutes from './routes/analytics';

// Import services
import { pluginSyncService } from './services/pluginSync';

const app = express();

// Rate limiting
const limiter = rateLimit(config.rateLimit);

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Plugin Marketplace API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: config.nodeEnv === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await initializeDatabase();
  
  // Start plugin sync service
  pluginSyncService.startPeriodicSync(5).catch(console.error);
  
  app.listen(config.port, () => {
    console.log(`🚀 Server is running on port ${config.port}`);
    console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${config.port}/health`);
  });
}

startServer().catch(console.error);

export default app;