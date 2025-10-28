"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = exports.TaskController = void 0;
const database_1 = require("../../../../../src/config/database");
const Task_1 = require("../models/Task");
const TaskCategory_1 = require("../models/TaskCategory");
class TaskController {
    constructor() {
        this.taskRepo = database_1.AppDataSource.getRepository(Task_1.Task);
        this.categoryRepo = database_1.AppDataSource.getRepository(TaskCategory_1.TaskCategory);
    }
    /**
     * GET /api/plugins/task-manager/tasks
     */
    async getTasks(req, res) {
        try {
            const { status, priority, categoryId, assignedToId, isArchived, search } = req.query;
            const queryBuilder = this.taskRepo.createQueryBuilder('task')
                .leftJoinAndSelect('task.category', 'category')
                .orderBy('task.position', 'ASC')
                .addOrderBy('task.createdAt', 'DESC');
            if (status) {
                queryBuilder.andWhere('task.status = :status', { status });
            }
            if (priority) {
                queryBuilder.andWhere('task.priority = :priority', { priority });
            }
            if (categoryId) {
                queryBuilder.andWhere('task.categoryId = :categoryId', { categoryId });
            }
            if (assignedToId) {
                queryBuilder.andWhere('task.assignedToId = :assignedToId', { assignedToId });
            }
            if (isArchived !== undefined) {
                queryBuilder.andWhere('task.isArchived = :isArchived', { isArchived: isArchived === 'true' });
            }
            if (search) {
                queryBuilder.andWhere('(task.title ILIKE :search OR task.description ILIKE :search)', { search: `%${search}%` });
            }
            const tasks = await queryBuilder.getMany();
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    /**
     * GET /api/plugins/task-manager/tasks/:id
     */
    async getTask(req, res) {
        try {
            const { id } = req.params;
            const task = await this.taskRepo.findOne({
                where: { id },
                relations: ['category']
            });
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json(task);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    /**
     * POST /api/plugins/task-manager/tasks
     */
    async createTask(req, res) {
        try {
            const userId = req.user?.id;
            const taskData = {
                ...req.body,
                createdById: userId
            };
            const task = this.taskRepo.create(taskData);
            await this.taskRepo.save(task);
            const savedTask = await this.taskRepo.findOne({
                where: { id: task.id },
                relations: ['category']
            });
            res.status(201).json(savedTask);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    /**
     * PUT /api/plugins/task-manager/tasks/:id
     */
    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const task = await this.taskRepo.findOne({ where: { id } });
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            // Si se marca como completada, guardar timestamp
            if (req.body.status === Task_1.TaskStatus.DONE && task.status !== Task_1.TaskStatus.DONE) {
                req.body.completedAt = new Date();
            }
            Object.assign(task, req.body);
            await this.taskRepo.save(task);
            const updatedTask = await this.taskRepo.findOne({
                where: { id },
                relations: ['category']
            });
            res.json(updatedTask);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    /**
     * DELETE /api/plugins/task-manager/tasks/:id
     */
    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const task = await this.taskRepo.findOne({ where: { id } });
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            await this.taskRepo.remove(task);
            res.json({ message: 'Task deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    /**
     * GET /api/plugins/task-manager/categories
     */
    async getCategories(req, res) {
        try {
            const categories = await this.categoryRepo.find({
                where: { isActive: true },
                order: { position: 'ASC', name: 'ASC' }
            });
            res.json(categories);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    /**
     * POST /api/plugins/task-manager/categories
     */
    async createCategory(req, res) {
        try {
            const category = this.categoryRepo.create(req.body);
            await this.categoryRepo.save(category);
            res.status(201).json(category);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    /**
     * PUT /api/plugins/task-manager/categories/:id
     */
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await this.categoryRepo.findOne({ where: { id } });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            Object.assign(category, req.body);
            await this.categoryRepo.save(category);
            res.json(category);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    /**
     * DELETE /api/plugins/task-manager/categories/:id
     */
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await this.categoryRepo.findOne({ where: { id } });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            await this.categoryRepo.remove(category);
            res.json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    /**
     * GET /api/plugins/task-manager/stats
     */
    async getStats(req, res) {
        try {
            const total = await this.taskRepo.count();
            const todo = await this.taskRepo.count({ where: { status: Task_1.TaskStatus.TODO } });
            const inProgress = await this.taskRepo.count({ where: { status: Task_1.TaskStatus.IN_PROGRESS } });
            const done = await this.taskRepo.count({ where: { status: Task_1.TaskStatus.DONE } });
            const overdue = await this.taskRepo.createQueryBuilder('task')
                .where('task.dueDate < :now', { now: new Date() })
                .andWhere('task.status != :done', { done: Task_1.TaskStatus.DONE })
                .getCount();
            res.json({
                total,
                todo,
                inProgress,
                done,
                overdue
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.TaskController = TaskController;
exports.taskController = new TaskController();
