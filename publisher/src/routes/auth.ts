import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PublisherDataSource } from '../config/database';
import { PublisherUser } from '../entities';

const router = Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔑 Login attempt:', { email, password: '***' });
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Buscar usuario en la base de datos
    const userRepository = PublisherDataSource.getRepository(PublisherUser);
    const user = await userRepository.findOne({ where: { email } });
    
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
    
    console.log('✅ Login successful:', { userId: user.id, email: user.email });
    
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
    
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }
    
    // Inicializar repositorio
    const userRepository = PublisherDataSource.getRepository(PublisherUser);
    
    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findOne({ 
      where: [
        { email },
        { username }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear nuevo usuario
    const newUser = userRepository.create({
      email,
      username,
      password: hashedPassword,
      role
    });
    
    // Guardar en la base de datos
    const savedUser = await userRepository.save(newUser);
    
    console.log('✅ User created in database:', { 
      id: savedUser.id, 
      email: savedUser.email, 
      username: savedUser.username 
    });
    
    // Generar token
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email, username: savedUser.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      user: {
        id: savedUser.id,
        email: savedUser.email,
        username: savedUser.username,
        role: savedUser.role,
        createdAt: savedUser.createdAt
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