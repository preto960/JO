import { Router } from 'express';
import {
  getPlugins,
  getPluginsByStatus,
  getPluginById,
  createPlugin,
  updatePlugin,
  updatePluginStatus,
  deletePlugin,
  getMyPlugins,
  syncPlugin
} from '@/controllers/pluginController';
import { testSimple } from '@/controllers/simpleTest';
import { authenticateToken, requireDeveloper } from '@/middleware/auth';
import { validateApiKey } from '@/middleware/apiAuth';
import { pluginValidation, validateRequest } from '@/middleware/validation';

const router = Router();

// Specific routes first (must come before /:id)
router.get('/test', testSimple);
router.get('/my/plugins', authenticateToken, requireDeveloper, getMyPlugins);

// General routes
router.get('/', getPlugins);
router.get('/status/:status', getPluginsByStatus);
router.get('/:id', getPluginById);

// Action routes
router.post('/', authenticateToken, requireDeveloper, pluginValidation, validateRequest, createPlugin);
router.put('/:id', authenticateToken, requireDeveloper, pluginValidation, validateRequest, updatePlugin);
router.patch('/:id/status', authenticateToken, updatePluginStatus);
router.delete('/:id', authenticateToken, requireDeveloper, deletePlugin);

// Sync route (for publisher - requires API key)
router.post('/sync', validateApiKey, syncPlugin);

export default router;