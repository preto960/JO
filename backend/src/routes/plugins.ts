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
import { testSimple } from '@/controllers/simpleTest';
import { authenticateToken, requireDeveloper } from '@/middleware/auth';
import { pluginValidation, validateRequest } from '@/middleware/validation';

const router = Router();

// Specific routes first (must come before /:id)
router.get('/test', testSimple);
router.get('/my/plugins', authenticateToken, requireDeveloper, getMyPlugins);

// General routes
router.get('/', getPlugins);
router.get('/:id', getPluginById);

// Action routes
router.post('/', authenticateToken, requireDeveloper, pluginValidation, validateRequest, createPlugin);
router.put('/:id', authenticateToken, requireDeveloper, pluginValidation, validateRequest, updatePlugin);
router.delete('/:id', authenticateToken, requireDeveloper, deletePlugin);
router.post('/sync', syncPlugin);

export default router;