import { Router } from 'express';
import { PermissionController } from '../controllers/permissionController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const permissionController = new PermissionController();

// All permission routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get all permissions
router.get('/', permissionController.getAllPermissions);

// Get permissions by role
router.get('/role/:role', permissionController.getPermissionsByRole);

// Check specific permission
router.get('/check', permissionController.checkPermission);

// Update single permission
router.put('/', permissionController.updatePermission);

// Bulk update permissions
router.put('/bulk', permissionController.bulkUpdatePermissions);

// Reset permissions to default
router.post('/reset', permissionController.resetPermissions);

export default router;

