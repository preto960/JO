import { Router } from 'express';
import { register, login, getProfile, updateProfile, logout } from '@/controllers/authController';
import { authenticateToken } from '@/middleware/auth';
import { registerValidation, loginValidation, validateRequest } from '@/middleware/validation';

const router = Router();

// Register
router.post('/register', registerValidation, validateRequest, register);

// Login
router.post('/login', loginValidation, validateRequest, login);

// Get profile
router.get('/profile', authenticateToken, getProfile);

// Update profile
router.put('/profile', authenticateToken, updateProfile);

// Logout
router.post('/logout', authenticateToken, logout);

export default router;