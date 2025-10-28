"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const router = (0, express_1.Router)();
// Task routes
router.get('/tasks', TaskController_1.taskController.getTasks.bind(TaskController_1.taskController));
router.get('/tasks/:id', TaskController_1.taskController.getTask.bind(TaskController_1.taskController));
router.post('/tasks', TaskController_1.taskController.createTask.bind(TaskController_1.taskController));
router.put('/tasks/:id', TaskController_1.taskController.updateTask.bind(TaskController_1.taskController));
router.delete('/tasks/:id', TaskController_1.taskController.deleteTask.bind(TaskController_1.taskController));
// Category routes
router.get('/categories', TaskController_1.taskController.getCategories.bind(TaskController_1.taskController));
router.post('/categories', TaskController_1.taskController.createCategory.bind(TaskController_1.taskController));
router.put('/categories/:id', TaskController_1.taskController.updateCategory.bind(TaskController_1.taskController));
router.delete('/categories/:id', TaskController_1.taskController.deleteCategory.bind(TaskController_1.taskController));
// Stats
router.get('/stats', TaskController_1.taskController.getStats.bind(TaskController_1.taskController));
exports.default = router;
