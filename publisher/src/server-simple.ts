import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware básico
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3003'],
  credentials: true
}));

app.use(express.json());

// Health check básico
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'publisher-api',
    timestamp: new Date().toISOString()
  });
});

// Endpoint básico de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Iniciar servidor sin base de datos primero
app.listen(PORT, () => {
  console.log(`🚀 Publisher API simplificado corriendo en puerto ${PORT}`);
  console.log(`📊 Dashboard disponible en: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});