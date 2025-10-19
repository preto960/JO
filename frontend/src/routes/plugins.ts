import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { query, get, run } from '../database';
import { PluginCreateRequest, PluginUpdateRequest } from '../types';

const router = Router();

// Get all plugins for the authenticated publisher
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const publisherId = req.publisher!.id;
    const plugins = await query(
      'SELECT * FROM plugins WHERE publisherId = ? ORDER BY createdAt DESC',
      [publisherId]
    );

    res.json({
      success: true,
      plugins
    });
  } catch (error) {
    console.error('Get plugins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single plugin
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const publisherId = req.publisher!.id;

    const plugin = await get(
      'SELECT * FROM plugins WHERE id = ? AND publisherId = ?',
      [id, publisherId]
    );

    if (!plugin) {
      return res.status(404).json({
        success: false,
        message: 'Plugin not found'
      });
    }

    res.json({
      success: true,
      plugin
    });
  } catch (error) {
    console.error('Get plugin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new plugin
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, description, version, category, price }: PluginCreateRequest = req.body;
    const publisherId = req.publisher!.id;

    if (!name || !description || !version || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const pluginId = `plugin_${Date.now()}`;
    
    await run(
      `INSERT INTO plugins (id, name, description, version, category, price, publisherId) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [pluginId, name, description, version, category, price, publisherId]
    );

    const plugin = await get('SELECT * FROM plugins WHERE id = ?', [pluginId]);

    res.status(201).json({
      success: true,
      message: 'Plugin created successfully',
      plugin
    });
  } catch (error) {
    console.error('Create plugin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update plugin
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const publisherId = req.publisher!.id;
    const updates: PluginUpdateRequest = req.body;

    // Check if plugin exists and belongs to publisher
    const existingPlugin = await get(
      'SELECT * FROM plugins WHERE id = ? AND publisherId = ?',
      [id, publisherId]
    );

    if (!existingPlugin) {
      return res.status(404).json({
        success: false,
        message: 'Plugin not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(updates.name);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(updates.description);
    }
    if (updates.version !== undefined) {
      updateFields.push('version = ?');
      updateValues.push(updates.version);
    }
    if (updates.category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(updates.category);
    }
    if (updates.price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(updates.price);
    }
    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(updates.status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push('updatedAt = CURRENT_TIMESTAMP');
    updateValues.push(id);

    await run(
      `UPDATE plugins SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const updatedPlugin = await get('SELECT * FROM plugins WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Plugin updated successfully',
      plugin: updatedPlugin
    });
  } catch (error) {
    console.error('Update plugin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete plugin
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const publisherId = req.publisher!.id;

    // Check if plugin exists and belongs to publisher
    const existingPlugin = await get(
      'SELECT * FROM plugins WHERE id = ? AND publisherId = ?',
      [id, publisherId]
    );

    if (!existingPlugin) {
      return res.status(404).json({
        success: false,
        message: 'Plugin not found'
      });
    }

    await run('DELETE FROM plugins WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Plugin deleted successfully'
    });
  } catch (error) {
    console.error('Delete plugin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export { router as pluginRoutes };