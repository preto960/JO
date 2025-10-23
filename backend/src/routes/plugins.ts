import { Router } from 'express';
import {
  getPlugins,
  getPluginById,
  createPlugin,
  updatePlugin,
  deletePlugin,
  getMyPlugins,
  syncPlugin
} from '@/controllers/pluginController';
import { syncPluginsManually } from '@/controllers/syncController';
import { authenticateToken, requireDeveloper } from '@/middleware/auth';
import { pluginValidation, validateRequest } from '@/middleware/validation';

const router = Router();

// Public routes
router.get('/', getPlugins);
router.get('/:id', getPluginById);

// Sync route (temporary)
router.post('/sync-manual', syncPluginsManually);

// Protected routes
router.post('/', authenticateToken, requireDeveloper, pluginValidation, validateRequest, createPlugin);
router.put('/:id', authenticateToken, requireDeveloper, pluginValidation, validateRequest, updatePlugin);
router.delete('/:id', authenticateToken, requireDeveloper, deletePlugin);

// Developer routes
router.get('/my/plugins', authenticateToken, requireDeveloper, getMyPlugins);

// Sync route (for publisher)
router.post('/sync', syncPlugin);

export default router;