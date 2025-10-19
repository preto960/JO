import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { authRoutes } from './routes/auth';
import { pluginRoutes } from './routes/plugins';
import { analyticsRoutes } from './routes/analytics';
import { initializeDatabase } from './database';

const app = express();
const server = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plugins', pluginRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files (frontend)
app.use(express.static('dist/frontend'));

// Catch all handler for frontend routing
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist/frontend' });
});

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    await initializeDatabase();
    
    server.listen(PORT, () => {
      console.log(`🚀 Publisher Dashboard running on port ${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();