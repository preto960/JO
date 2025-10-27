import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import { PluginController } from '../controllers/pluginController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const pluginController = new PluginController();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
      cb(null, true);
    } else {
      cb(new Error('Only .zip files are allowed'));
    }
  }
});

const pluginValidation = [
  body('name').notEmpty().withMessage('Plugin name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('version').notEmpty().withMessage('Version is required')
];

// Public routes
router.get('/', pluginController.getPlugins);
router.get('/published', pluginController.getPlugins); // Alias for published plugins
router.get('/:id', pluginController.getPlugin);
router.get('/:id/download', pluginController.downloadPlugin);

// Protected routes
router.get('/my/plugins', authenticateToken, pluginController.getMyPlugins);
router.post('/', authenticateToken, pluginValidation, pluginController.createPlugin);
router.put('/:id', authenticateToken, pluginController.updatePlugin);
router.delete('/:id', authenticateToken, pluginController.deletePlugin);
router.post('/:id/upload', authenticateToken, upload.single('package'), pluginController.uploadPackage);
router.post('/:id/publish', authenticateToken, pluginController.publishPlugin);

export { router as pluginRoutes };

