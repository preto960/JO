import { Router } from 'express';
import { body } from 'express-validator';
import { ReviewController } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const reviewController = new ReviewController();

// Public routes
router.get('/', reviewController.getReviews);

// Protected routes
router.post('/', 
  authenticateToken,
  [
    body('pluginId').notEmpty().withMessage('Plugin ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').notEmpty().withMessage('Review title is required'),
    body('content').notEmpty().withMessage('Review content is required')
  ],
  reviewController.createReview
);

router.put('/:id', 
  authenticateToken,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').optional().notEmpty().withMessage('Review title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Review content cannot be empty')
  ],
  reviewController.updateReview
);

router.delete('/:id', authenticateToken, reviewController.deleteReview);
router.post('/:id/respond', 
  authenticateToken,
  [
    body('response').notEmpty().withMessage('Response is required')
  ],
  reviewController.respondToReview
);

export { router as reviewRoutes };