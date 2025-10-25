import { Router } from 'express';
import { body } from 'express-validator';
import { PluginController } from '../controllers/pluginController';
import { authenticateToken, requireDeveloper } from '../middleware/auth';

const router = Router();
const pluginController = new PluginController();

// Public routes
router.get('/', pluginController.getPlugins);
router.get('/:id', pluginController.getPlugin);

// Protected routes
router.post('/', 
  authenticateToken, 
  requireDeveloper,
  [
    body('name').notEmpty().withMessage('Plugin name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('version').notEmpty().withMessage('Version is required')
  ],
  pluginController.createPlugin
);

router.put('/:id', 
  authenticateToken, 
  requireDeveloper,
  pluginController.updatePlugin
);

router.delete('/:id', 
  authenticateToken, 
  requireDeveloper,
  pluginController.deletePlugin
);

router.get('/my/plugins', 
  authenticateToken, 
  requireDeveloper,
  pluginController.getMyPlugins
);

router.post('/:id/submit', 
  authenticateToken, 
  requireDeveloper,
  pluginController.submitForReview
);

export { router as pluginRoutes };