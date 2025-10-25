import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken, requireDeveloper } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

// All analytics routes require authentication and developer role
router.use(authenticateToken);
router.use(requireDeveloper);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/plugin/:pluginId', analyticsController.getPluginAnalytics);
router.get('/revenue', analyticsController.getRevenueAnalytics);

export { router as analyticsRoutes };