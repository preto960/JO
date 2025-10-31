import { Router } from 'express';
import { taskController } from '../controllers/TaskController';

const router = Router();

// Task routes
router.get('/tasks', taskController.getTasks.bind(taskController));
router.get('/tasks/:id', taskController.getTask.bind(taskController));
router.post('/tasks', taskController.createTask.bind(taskController));
router.put('/tasks/:id', taskController.updateTask.bind(taskController));
router.delete('/tasks/:id', taskController.deleteTask.bind(taskController));

// Category routes
router.get('/categories', taskController.getCategories.bind(taskController));
router.post('/categories', taskController.createCategory.bind(taskController));
router.put('/categories/:id', taskController.updateCategory.bind(taskController));
router.delete('/categories/:id', taskController.deleteCategory.bind(taskController));

// Stats
router.get('/stats', taskController.getStats.bind(taskController));

export default router;



