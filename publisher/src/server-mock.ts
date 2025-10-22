import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT_BACKEND || 3004;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3003'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'publisher-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0-simple'
  });
});

// Auth routes (sin base de datos por ahora)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulación de autenticación - acepta cualquier credencial
  if (email && password) {
    const mockUser = {
      id: '1',
      email,
      username: email.split('@')[0] || 'developer',
      role: 'DEVELOPER'
    };
    
    res.json({
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    });
  } else {
    res.status(400).json({ error: 'Se requieren email y password' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, username, password, role } = req.body;
  
  // Simulación de registro - acepta cualquier dato
  if (email && username && password) {
    const mockUser = {
      id: '1',
      email,
      username,
      role: role || 'DEVELOPER'
    };
    
    res.json({
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    });
  } else {
    res.status(400).json({ error: 'Se requieren email, username y password' });
  }
});

// Plugins routes (simuladas)
app.get('/api/plugins', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Plugin Ejemplo',
      description: 'Este es un plugin de ejemplo para demostrar la funcionalidad del Publisher Dashboard',
      version: '1.0.0',
      price: 29.99,
      category: 'productivity',
      tags: ['productivity', 'automation', 'tools'],
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.5,
      _count: {
        reviews: 12,
        purchases: 150
      }
    },
    {
      id: '2',
      title: 'Analytics Dashboard',
      description: 'Un plugin completo para analizar métricas y estadísticas en tiempo real',
      version: '2.1.0',
      price: 49.99,
      category: 'analytics',
      tags: ['analytics', 'dashboard', 'metrics'],
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.8,
      _count: {
        reviews: 25,
        purchases: 89
      }
    },
    {
      id: '3',
      title: 'Code Formatter',
      description: 'Herramienta automática para formatear y organizar código fuente',
      version: '1.5.2',
      price: 19.99,
      category: 'development',
      tags: ['development', 'code', 'formatter'],
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.2,
      _count: {
        reviews: 8,
        purchases: 45
      }
    }
  ]);
});

app.post('/api/plugins', (req, res) => {
  const plugin = { 
    id: Date.now().toString(),
    title: req.body.title || 'New Plugin',
    description: req.body.description || 'Plugin description',
    version: '1.0.0',
    price: req.body.price || 0,
    category: req.body.category || 'productivity',
    tags: req.body.tags || [],
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '1',
      username: 'developer'
    },
    avgRating: 0,
    _count: {
      reviews: 0,
      purchases: 0
    }
  };
  res.json(plugin);
});

app.get('/api/plugins/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    title: `Plugin ${id}`,
    description: 'Plugin description',
    version: '1.0.0',
    price: 29.99,
    category: 'productivity',
    tags: ['productivity', 'tools'],
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: '1',
      username: 'developer'
    },
    avgRating: 4.5,
    _count: {
      reviews: 10,
      purchases: 100
    }
  });
});

app.put('/api/plugins/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    id, 
    ...req.body, 
    updatedAt: new Date().toISOString(),
    author: {
      id: '1',
      username: 'developer'
    },
    avgRating: 4.5,
    _count: {
      reviews: 10,
      purchases: 100
    }
  });
});

app.delete('/api/plugins/:id', (req, res) => {
  res.json({ message: 'Plugin eliminado correctamente' });
});

// Get plugins by status
app.get('/api/plugins/status/:status', (req, res) => {
  const { status } = req.params;
  
  let plugins = [
    {
      id: '1',
      title: 'Plugin Ejemplo',
      description: 'Este es un plugin de ejemplo para demostrar la funcionalidad del Publisher Dashboard',
      version: '1.0.0',
      price: 29.99,
      category: 'productivity',
      tags: ['productivity', 'automation', 'tools'],
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.5,
      _count: {
        reviews: 12,
        purchases: 150
      }
    },
    {
      id: '2',
      title: 'Analytics Dashboard',
      description: 'Un plugin completo para analizar métricas y estadísticas en tiempo real',
      version: '2.1.0',
      price: 49.99,
      category: 'analytics',
      tags: ['analytics', 'dashboard', 'metrics'],
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.8,
      _count: {
        reviews: 25,
        purchases: 89
      }
    },
    {
      id: '3',
      title: 'Code Formatter',
      description: 'Herramienta automática para formatear y organizar código fuente',
      version: '1.5.2',
      price: 19.99,
      category: 'development',
      tags: ['development', 'code', 'formatter'],
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.2,
      _count: {
        reviews: 8,
        purchases: 45
      }
    },
    {
      id: '4',
      title: 'API Tester',
      description: 'Plugin para probar y documentar APIs REST',
      version: '1.0.0',
      price: 0,
      category: 'development',
      tags: ['development', 'api', 'testing'],
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 0,
      _count: {
        reviews: 0,
        purchases: 0
      }
    }
  ];
  
  // Filter by status
  const filteredPlugins = plugins.filter(plugin => plugin.status === status.toUpperCase());
  
  res.json(filteredPlugins);
});

// Update plugin status
app.patch('/api/plugins/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Mock response - in real implementation this would update the database
  res.json({
    id,
    status: status.toUpperCase(),
    updatedAt: new Date().toISOString(),
    message: `Plugin status updated to ${status.toUpperCase()}`
  });
});

// My plugins route
app.get('/api/plugins/my/plugins', (req, res) => {
  const { status, category, page = 1, limit = 10 } = req.query;
  
  let plugins = [
    {
      id: '1',
      title: 'Plugin Ejemplo',
      description: 'Este es un plugin de ejemplo para demostrar la funcionalidad del Publisher Dashboard',
      version: '1.0.0',
      price: 29.99,
      category: 'productivity',
      tags: ['productivity', 'automation', 'tools'],
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.5,
      _count: {
        reviews: 12,
        purchases: 150
      }
    },
    {
      id: '2',
      title: 'Analytics Dashboard',
      description: 'Un plugin completo para analizar métricas y estadísticas en tiempo real',
      version: '2.1.0',
      price: 49.99,
      category: 'analytics',
      tags: ['analytics', 'dashboard', 'metrics'],
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.8,
      _count: {
        reviews: 25,
        purchases: 89
      }
    },
    {
      id: '3',
      title: 'Code Formatter',
      description: 'Herramienta automática para formatear y organizar código fuente',
      version: '1.5.2',
      price: 19.99,
      category: 'development',
      tags: ['development', 'code', 'formatter'],
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 4.2,
      _count: {
        reviews: 8,
        purchases: 45
      }
    },
    {
      id: '4',
      title: 'API Tester',
      description: 'Plugin para probar y documentar APIs REST',
      version: '1.0.0',
      price: 0,
      category: 'development',
      tags: ['development', 'api', 'testing'],
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: '1',
        username: 'developer'
      },
      avgRating: 0,
      _count: {
        reviews: 0,
        purchases: 0
      }
    }
  ];
  
  // Apply filters
  if (status) {
    plugins = plugins.filter(p => p.status === status);
  }
  
  if (category) {
    plugins = plugins.filter(p => p.category === category);
  }
  
  // Apply pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const paginatedPlugins = plugins.slice(startIndex, endIndex);
  
  res.json({
    plugins: paginatedPlugins,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: plugins.length,
      pages: Math.ceil(plugins.length / limitNum)
    }
  });
});

// Analytics routes (simuladas)
app.get('/api/analytics/overview', (req, res) => {
  res.json({
    totalRevenue: 375.50,
    totalSales: 1250,
    totalPlugins: 3,
    avgRating: 4.5
  });
});

app.get('/api/analytics/performance', (req, res) => {
  res.json({
    daily: [
      { date: '2024-01-01', downloads: 45, revenue: 13.50, views: 230 },
      { date: '2024-01-02', downloads: 52, revenue: 15.60, views: 285 },
      { date: '2024-01-03', downloads: 38, revenue: 11.40, views: 198 },
      { date: '2024-01-04', downloads: 61, revenue: 18.30, views: 342 },
      { date: '2024-01-05', downloads: 43, revenue: 12.90, views: 267 }
    ]
  });
});

app.get('/api/analytics/my', (req, res) => {
  const { days = 30 } = req.query;
  const daysNum = parseInt(days as string);
  
  // Generate mock data for the specified number of days
  const dailyStats = [];
  const today = new Date();
  
  for (let i = daysNum - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    dailyStats.push({
      date: date.toISOString().split('T')[0],
      downloads: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 50) + 10,
      views: Math.floor(Math.random() * 500) + 100
    });
  }
  
  res.json({
    totalRevenue: 375.50,
    totalSales: 1250,
    totalDownloads: 284,
    totalPlugins: 3,
    avgRating: 4.5,
    dailyStats,
    pluginStats: [
      {
        pluginId: '1',
        pluginTitle: 'Plugin Ejemplo',
        downloads: 150,
        revenue: 45.99,
        rating: 4.5
      },
      {
        pluginId: '2',
        pluginTitle: 'Analytics Dashboard',
        downloads: 89,
        revenue: 89.01,
        rating: 4.8
      },
      {
        pluginId: '3',
        pluginTitle: 'Code Formatter',
        downloads: 45,
        revenue: 8.99,
        rating: 4.2
      }
    ]
  });
});

app.get('/api/analytics', (req, res) => {
  res.json({
    totalRevenue: 375.50,
    totalSales: 1250,
    totalPlugins: 3,
    avgRating: 4.5,
    dailyStats: [
      { date: '2024-01-01', downloads: 45, revenue: 13.50, views: 230 },
      { date: '2024-01-02', downloads: 52, revenue: 15.60, views: 285 },
      { date: '2024-01-03', downloads: 38, revenue: 11.40, views: 198 },
      { date: '2024-01-04', downloads: 61, revenue: 18.30, views: 342 },
      { date: '2024-01-05', downloads: 43, revenue: 12.90, views: 267 }
    ],
    pluginStats: [
      {
        pluginId: '1',
        pluginTitle: 'Plugin Ejemplo',
        downloads: 150,
        revenue: 45.99,
        rating: 4.5
      },
      {
        pluginId: '2',
        pluginTitle: 'Analytics Dashboard',
        downloads: 89,
        revenue: 89.01,
        rating: 4.8
      },
      {
        pluginId: '3',
        pluginTitle: 'Code Formatter',
        downloads: 45,
        revenue: 8.99,
        rating: 4.2
      }
    ]
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Publisher API corriendo en puerto ${PORT}`);
  console.log(`📊 Dashboard disponible en: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/login, /api/auth/register`);
  console.log(`🔌 Plugins endpoints: http://localhost:${PORT}/api/plugins`);
  console.log(`📊 Analytics endpoints: http://localhost:${PORT}/api/analytics`);
});