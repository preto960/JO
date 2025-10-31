import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { websocketService } from './services/websocketService';
import { pluginLoaderService } from './services/pluginLoaderService';
import { authRoutes } from './routes/auth';
import { pluginRoutes } from './routes/plugins';
import { aiRoutes } from './routes/ai';
import { analyticsRoutes } from './routes/analytics';
import { reviewRoutes } from './routes/reviews';
import { installedPluginRoutes } from './routes/installedPlugins';
import { marketRoutes } from './routes/market';
import { pluginAssetsRoutes } from './routes/pluginAssets';
import { pluginBundlesRoutes } from './routes/pluginBundles';
import { pluginApiRoutes } from './routes/pluginApi';
import permissionRoutes from './routes/permissions';

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'AI Plugin Marketplace API',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/installed-plugins', installedPluginRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/plugin-assets', pluginAssetsRoutes);
app.use('/api/plugin-bundles', pluginBundlesRoutes);
app.use('/api/plugin-api', pluginApiRoutes);
app.use('/api/permissions', permissionRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Create HTTP server for WebSocket support
const httpServer = createServer(app);

// Initialize WebSocket
websocketService.initialize(httpServer);

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Database connected successfully');
    
    // Initialize plugin loader service
    await pluginLoaderService.initialize();
    
    // Load all active plugins
    await pluginLoaderService.loadAllActivePlugins();
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 WebSocket server ready`);
      console.log(`📦 Plugin system ready`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

export default app;