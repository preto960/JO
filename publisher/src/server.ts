import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PublisherDataSource } from './config/database';
import authRoutes from './routes/auth';
import pluginRoutes from './routes/plugins';
import analyticsRoutes from './routes/analytics';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
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
    await PublisherDataSource.initialize();
    console.log('✅ Publisher Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Publisher API running on port ${PORT}`);
      console.log(`📊 Dashboard available at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start publisher server:', error);
    process.exit(1);
  }
};

startServer();