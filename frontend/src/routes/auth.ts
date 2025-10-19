import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { get, run } from '../database';
import { generateToken } from '../middleware/auth';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, name, password }: RegisterRequest = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      } as AuthResponse);
    }

    // Check if publisher already exists
    const existingPublisher = await get('SELECT * FROM publishers WHERE email = ?', [email]);
    if (existingPublisher) {
      return res.status(400).json({
        success: false,
        message: 'Publisher already exists'
      } as AuthResponse);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const publisherId = `pub_${Date.now()}`;

    // Create publisher
    await run(
      'INSERT INTO publishers (id, email, name, password) VALUES (?, ?, ?, ?)',
      [publisherId, email, name, hashedPassword]
    );

    // Generate token
    const token = generateToken({ id: publisherId, email, name });

    res.status(201).json({
      success: true,
      message: 'Publisher registered successfully',
      publisher: { id: publisherId, email, name },
      token
    } as AuthResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as AuthResponse);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      } as AuthResponse);
    }

    // Find publisher
    const publisher = await get('SELECT * FROM publishers WHERE email = ?', [email]);
    if (!publisher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as AuthResponse);
    }

    // Check password
    const validPassword = await bcrypt.compare(password, publisher.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      } as AuthResponse);
    }

    // Generate token
    const token = generateToken({ 
      id: publisher.id, 
      email: publisher.email, 
      name: publisher.name 
    });

    res.json({
      success: true,
      message: 'Login successful',
      publisher: { 
        id: publisher.id, 
        email: publisher.email, 
        name: publisher.name 
      },
      token
    } as AuthResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as AuthResponse);
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      } as AuthResponse);
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'publisher-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const publisher = await get('SELECT id, email, name FROM publishers WHERE id = ?', [decoded.id]);
    if (!publisher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      } as AuthResponse);
    }

    res.json({
      success: true,
      message: 'Token is valid',
      publisher
    } as AuthResponse);
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid token'
    } as AuthResponse);
  }
});

export { router as authRoutes };