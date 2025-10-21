import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

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
  
  // Simulación de autenticación
  if (email && password) {
    res.json({
      user: {
        id: '1',
        email,
        username: email.split('@')[0],
        role: 'DEVELOPER'
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    });
  } else {
    res.status(400).json({ error: 'Credenciales inválidas' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, username, password, role } = req.body;
  
  // Simulación de registro
  if (email && username && password) {
    res.json({
      user: {
        id: '1',
        email,
        username,
        role: role || 'DEVELOPER'
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    });
  } else {
    res.status(400).json({ error: 'Datos incompletos' });
  }
});

// Plugins routes (simuladas)
app.get('/api/plugins', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Plugin Ejemplo',
      description: 'Este es un plugin de ejemplo',
      version: '1.0.0',
      status: 'PUBLISHED',
      downloads: 150,
      revenue: 45.99,
      createdAt: new Date().toISOString()
    }
  ]);
});

app.post('/api/plugins', (req, res) => {
  const plugin = { ...req.body, id: Date.now().toString() };
  res.json(plugin);
});

app.put('/api/plugins/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, ...req.body, updatedAt: new Date().toISOString() });
});

app.delete('/api/plugins/:id', (req, res) => {
  res.json({ message: 'Plugin eliminado correctamente' });
});

// Analytics routes (simuladas)
app.get('/api/analytics/overview', (req, res) => {
  res.json({
    totalDownloads: 1250,
    totalRevenue: 375.50,
    activePlugins: 3,
    monthlyGrowth: 15.5
  });
});

app.get('/api/analytics/performance', (req, res) => {
  res.json({
    daily: [
      { date: '2024-01-01', downloads: 45, revenue: 13.50 },
      { date: '2024-01-02', downloads: 52, revenue: 15.60 },
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