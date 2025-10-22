import { Router } from 'express';
import { getAnalytics } from '@/controllers/analyticsController';
import { authenticateToken, requireDeveloper } from '@/middleware/auth';

const router = Router();

// Developer routes
router.get('/my', authenticateToken, requireDeveloper, getAnalytics);

export default router;