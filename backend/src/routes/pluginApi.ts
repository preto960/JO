import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';

const router = Router();

/**
 * API Proxy para plugins
 * Los plugins pueden hacer llamadas a /api/plugin-api/:pluginSlug/*
 * y estas se ejecutarán en el contexto del plugin
 */

/**
 * GET /api/plugin-api/task-manager/tasks
 * Obtiene todas las tareas
 */
router.get('/task-manager/tasks', async (req: Request, res: Response) => {
  try {
    const { status, priority, categoryId, assignedToId } = req.query;
    
    let query = `
      SELECT t.*, c.name as "categoryName", c.color as "categoryColor"
      FROM plugin_tasks t
      LEFT JOIN plugin_task_categories c ON t."categoryId" = c.id
      WHERE t."isArchived" = false
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (priority) {
      query += ` AND t.priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    if (categoryId) {
      query += ` AND t."categoryId" = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    if (assignedToId) {
      query += ` AND t."assignedToId" = $${paramIndex}`;
      params.push(assignedToId);
      paramIndex++;
    }

    query += ` ORDER BY t.position ASC, t."createdAt" DESC`;

    const result = await AppDataSource.query(query, params);
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * GET /api/plugin-api/task-manager/tasks/:id
 * Obtiene una tarea específica
 */
router.get('/task-manager/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await AppDataSource.query(`
      SELECT t.*, c.name as "categoryName", c.color as "categoryColor"
      FROM plugin_tasks t
      LEFT JOIN plugin_task_categories c ON t."categoryId" = c.id
      WHERE t.id = $1
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result[0]);
  } catch (error: any) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/plugin-api/task-manager/tasks
 * Crea una nueva tarea
 */
router.post('/task-manager/tasks', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      status = 'TODO',
      priority = 'MEDIUM',
      categoryId,
      assignedToId,
      createdById,
      dueDate,
      startDate,
      estimatedHours = 0,
      tags = []
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await AppDataSource.query(`
      INSERT INTO plugin_tasks (
        title, description, status, priority, "categoryId", 
        "assignedToId", "createdById", "dueDate", "startDate", 
        "estimatedHours", tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      title, description, status, priority, categoryId || null,
      assignedToId || null, createdById || null, dueDate || null, 
      startDate || null, estimatedHours, tags.join(',')
    ]);

    res.status(201).json(result[0]);
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * PATCH /api/plugin-api/task-manager/tasks/:id
 * Actualiza una tarea
 */
router.patch('/task-manager/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      'title', 'description', 'status', 'priority', 'categoryId',
      'assignedToId', 'dueDate', 'startDate', 'completedAt',
      'estimatedHours', 'actualHours', 'tags', 'position', 'isArchived'
    ];

    const setClause: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        // Convertir camelCase a snake_case para columnas de BD
        const dbKey = key === 'categoryId' || key === 'assignedToId' || 
                      key === 'dueDate' || key === 'startDate' || 
                      key === 'completedAt' || key === 'estimatedHours' || 
                      key === 'actualHours' || key === 'isArchived'
          ? `"${key}"`
          : key;
        
        setClause.push(`${dbKey} = $${paramIndex}`);
        values.push(Array.isArray(updates[key]) ? updates[key].join(',') : updates[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    setClause.push(`"updatedAt" = NOW()`);
    values.push(id);

    const query = `
      UPDATE plugin_tasks
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await AppDataSource.query(query, values);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result[0]);
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * DELETE /api/plugin-api/task-manager/tasks/:id
 * Elimina una tarea
 */
router.delete('/task-manager/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await AppDataSource.query(`
      DELETE FROM plugin_tasks
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /api/plugin-api/task-manager/categories
 * Obtiene todas las categorías
 */
router.get('/task-manager/categories', async (req: Request, res: Response) => {
  try {
    const result = await AppDataSource.query(`
      SELECT * FROM plugin_task_categories
      WHERE "isActive" = true
      ORDER BY position ASC
    `);

    res.json(result);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/plugin-api/task-manager/categories
 * Crea una nueva categoría
 */
router.post('/task-manager/categories', async (req: Request, res: Response) => {
  try {
    const { name, description, color = '#3B82F6', icon, position = 0 } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const result = await AppDataSource.query(`
      INSERT INTO plugin_task_categories (name, description, color, icon, position)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, description, color, icon, position]);

    res.status(201).json(result[0]);
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as pluginApiRoutes };

