import { Router } from 'express';
import taskRoutes from './routes/tasks';

// Este archivo será el punto de entrada del plugin en el backend
// Las rutas se montarán en /api/plugins/task-manager

const router = Router();

// Montar las rutas de tareas
router.use('/', taskRoutes);

export default router;


