import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import backendApi from '../services/backend';

const router = express.Router();

// Schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Login (publisher only)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Login via backend API
    const response = await backendApi.post('/auth/login', { 
      email, 
      password, 
      type: 'publisher' 
    });
    
    const { token, user } = response.data;
    
    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error: any) {
    res.status(401).json({ 
      error: error.response?.data?.error || 'Invalid credentials' 
    });
  }
});

// Register (publisher only)
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = loginSchema.extend({
      name: z.string().min(2)
    }).parse(req.body);
    
    // Register via backend API
    const response = await backendApi.post('/auth/register', { 
      email, 
      name, 
      password, 
      type: 'publisher' 
    });
    
    const { token, user } = response.data;
    
    res.status(201).json({
      message: 'Publisher account created successfully',
      token,
      user
    });
  } catch (error: any) {
    res.status(400).json({ 
      error: error.response?.data?.error || 'Registration failed' 
    });
  }
});

export { router as authRoutes };