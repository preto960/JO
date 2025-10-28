import { Request, Response } from 'express';
import { AppDataSource } from '../../../../../src/config/database';
import { Task, TaskStatus, TaskPriority } from '../models/Task';
import { TaskCategory } from '../models/TaskCategory';

export class TaskController {
  private taskRepo = AppDataSource.getRepository(Task);
  private categoryRepo = AppDataSource.getRepository(TaskCategory);

  /**
   * GET /api/plugins/task-manager/tasks
   */
  async getTasks(req: Request, res: Response) {
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
        queryBuilder.andWhere(
          '(task.title ILIKE :search OR task.description ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      const tasks = await queryBuilder.getMany();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/plugins/task-manager/tasks/:id
   */
  async getTask(req: Request, res: Response) {
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * POST /api/plugins/task-manager/tasks
   */
  async createTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
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
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * PUT /api/plugins/task-manager/tasks/:id
   */
  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await this.taskRepo.findOne({ where: { id } });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Si se marca como completada, guardar timestamp
      if (req.body.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
        req.body.completedAt = new Date();
      }

      Object.assign(task, req.body);
      await this.taskRepo.save(task);

      const updatedTask = await this.taskRepo.findOne({
        where: { id },
        relations: ['category']
      });

      res.json(updatedTask);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * DELETE /api/plugins/task-manager/tasks/:id
   */
  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await this.taskRepo.findOne({ where: { id } });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      await this.taskRepo.remove(task);
      res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/plugins/task-manager/categories
   */
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await this.categoryRepo.find({
        where: { isActive: true },
        order: { position: 'ASC', name: 'ASC' }
      });
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * POST /api/plugins/task-manager/categories
   */
  async createCategory(req: Request, res: Response) {
    try {
      const category = this.categoryRepo.create(req.body);
      await this.categoryRepo.save(category);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * PUT /api/plugins/task-manager/categories/:id
   */
  async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await this.categoryRepo.findOne({ where: { id } });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      Object.assign(category, req.body);
      await this.categoryRepo.save(category);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * DELETE /api/plugins/task-manager/categories/:id
   */
  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await this.categoryRepo.findOne({ where: { id } });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await this.categoryRepo.remove(category);
      res.json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/plugins/task-manager/stats
   */
  async getStats(req: Request, res: Response) {
    try {
      const total = await this.taskRepo.count();
      const todo = await this.taskRepo.count({ where: { status: TaskStatus.TODO } });
      const inProgress = await this.taskRepo.count({ where: { status: TaskStatus.IN_PROGRESS } });
      const done = await this.taskRepo.count({ where: { status: TaskStatus.DONE } });
      const overdue = await this.taskRepo.createQueryBuilder('task')
        .where('task.dueDate < :now', { now: new Date() })
        .andWhere('task.status != :done', { done: TaskStatus.DONE })
        .getCount();

      res.json({
        total,
        todo,
        inProgress,
        done,
        overdue
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const taskController = new TaskController();


