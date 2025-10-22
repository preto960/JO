import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PublisherDataSource } from './config/database';
import authRoutes from './routes/auth';
import pluginRoutes from './routes/plugins';
import analyticsRoutes from './routes/analytics';
import { errorHandler } from './middleware/errorHandler';
import { PluginWatcher } from './services/pluginWatcher';

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3003', 'http://localhost:3004'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'publisher-api',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🔄 Starting Publisher API server...');
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    console.log('🔗 Connecting to database...');
    await PublisherDataSource.initialize();
    console.log('✅ Publisher Database connected successfully');
    
    // Iniciar sistema de monitoreo de plugins
    console.log('🔍 Iniciando sistema de monitoreo de plugins...');
    const pluginWatcher = new PluginWatcher();
    await pluginWatcher.start();
    
    // Manejar cierre graceful
    process.on('SIGINT', async () => {
      console.log('\n🛑 Deteniendo servidor...');
      await pluginWatcher.stop();
      process.exit(0);
    });
    
      // Handle port conflicts - try different ports
    const tryPort = async (port: number): Promise<number> => {
      return new Promise((resolve, reject) => {
        const testServer = app.listen(port, () => {
          testServer.close(() => {
            resolve(port);
          });
        }).on('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            if (port < 3100) {
              resolve(tryPort(port + 1));
            } else if (port < 9000) {
              resolve(tryPort(port + 1));
            } else {
              reject(new Error('No available ports found'));
            }
          } else {
            reject(err);
          }
        });
      });
    };

    const availablePort = await tryPort(typeof PORT === 'string' ? parseInt(PORT) : PORT);
    
    app.listen(availablePort, () => {
      console.log(`🚀 Publisher API running on port ${availablePort}`);
      console.log(`📊 Dashboard available at: http://localhost:${availablePort}`);
      console.log(`🔗 Health check: http://localhost:${availablePort}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${availablePort}/api/auth/login, /api/auth/register`);
      console.log(`💾 Database: Neon PostgreSQL connected`);
      console.log(`🔌 Plugin monitoring: ${pluginWatcher.getPluginsDir()}`);
    });
  } catch (error) {
    console.error('❌ Failed to start publisher server:', error);
    process.exit(1);
  }
};

startServer();