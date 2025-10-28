import { Router } from 'express';
import { localPluginController } from '../controllers/localPluginController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Detectar plugins locales
router.get('/', localPluginController.detectLocalPlugins);

// Obtener un plugin local específico
router.get('/:slug', localPluginController.getLocalPlugin);

// Construir un plugin
router.post('/:slug/build', localPluginController.buildPlugin);

// Construir y publicar en un solo paso
router.post('/:slug/build-and-publish', localPluginController.buildAndPublish);

// Construir para sandbox (testing)
router.post('/:slug/sandbox', localPluginController.buildForSandbox);

export { router as localPluginRoutes };


