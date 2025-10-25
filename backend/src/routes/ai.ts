import { Router } from 'express';
import { body } from 'express-validator';
import { AIController } from '../controllers/aiController';
import { authenticateToken, requireDeveloper } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

// AI endpoints rate limiting (more restrictive)
const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute for AI endpoints
  message: 'Too many AI requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();
const aiController = new AIController();

// All AI routes require authentication and developer role
router.use(authenticateToken);
router.use(requireDeveloper);
router.use(aiRateLimit);

// AI analysis endpoints
router.post('/analyze-plugin', 
  [
    body('pluginId').notEmpty().withMessage('Plugin ID is required')
  ],
  aiController.analyzePlugin
);

router.post('/generate-content', 
  [
    body('pluginId').notEmpty().withMessage('Plugin ID is required'),
    body('contentType').isIn(['description', 'documentation', 'marketing']).withMessage('Invalid content type')
  ],
  aiController.generateContent
);

router.post('/generate-image', 
  [
    body('pluginId').notEmpty().withMessage('Plugin ID is required'),
    body('imageType').isIn(['icon', 'screenshot', 'banner']).withMessage('Invalid image type')
  ],
  aiController.generateImage
);

router.post('/optimize-seo', 
  [
    body('pluginId').notEmpty().withMessage('Plugin ID is required')
  ],
  aiController.optimizeSEO
);

// Public recommendation endpoint (no auth required)
router.post('/recommend-plugins', 
  [
    body('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  aiController.recommendPlugins
);

export { router as aiRoutes };