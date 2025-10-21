import { Router } from 'express';
import {
  getPlugins,
  getPluginById,
  createPlugin,
  updatePlugin,
  deletePlugin,
  getMyPlugins
} from '@/controllers/pluginController';
import { authenticateToken, requireDeveloper } from '@/middleware/auth';
import { pluginValidation, validateRequest } from '@/middleware/validation';

const router = Router();

// Public routes
router.get('/', getPlugins);
router.get('/:id', getPluginById);

// Protected routes
router.post('/', authenticateToken, requireDeveloper, pluginValidation, validateRequest, createPlugin);
router.put('/:id', authenticateToken, requireDeveloper, pluginValidation, validateRequest, updatePlugin);
router.delete('/:id', authenticateToken, requireDeveloper, deletePlugin);

// Developer routes
router.get('/my/plugins', authenticateToken, requireDeveloper, getMyPlugins);

export default router;