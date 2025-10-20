import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();

// Mock user storage (en producción, usar base de datos)
const users: any[] = [];

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔑 Login attempt:', { email, password: '***' });
    
    // Buscar usuario por email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, role = 'DEVELOPER' } = req.body;
    
    console.log('📝 Register attempt:', { email, username, password: '***', role });
    
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email || u.username === username);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    console.log('✅ User created:', { id: newUser.id, email: newUser.email, username: newUser.username });
    
    // Generar token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, username: newUser.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      token
    });
    
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Refresh token route
router.post('/refresh', (req, res) => {
  res.json({ message: 'Token refresh endpoint' });
});

export default router;