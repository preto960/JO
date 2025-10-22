import { Router } from 'express';
import { getUserById, getMyStats } from '@/controllers/userController';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// Public routes
router.get('/:id', getUserById);

// Protected routes
router.get('/me/stats', authenticateToken, getMyStats);

export default router;