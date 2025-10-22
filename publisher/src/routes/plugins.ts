import { Router } from 'express';
import { PublisherDataSource } from '../config/database';
import { PublisherPlugin, PublisherPluginStatus } from '../entities/PublisherPlugin';
import { PublisherUser } from '../entities/PublisherUser';

const router = Router();

// Get all plugins
router.get('/', async (req, res) => {
  try {
    const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);
    const plugins = await pluginRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
    res.json(plugins);
  } catch (error) {
    console.error('Error fetching plugins:', error);
    res.status(500).json({ error: 'Failed to fetch plugins' });
  }
});

// Get plugin by ID
router.get('/:id', async (req, res) => {
  try {
    const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);
    const plugin = await pluginRepository.findOne({
      where: { id: req.params.id },
      relations: ['author']
    });
    
    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }
    
    res.json(plugin);
  } catch (error) {
    console.error('Error fetching plugin:', error);
    res.status(500).json({ error: 'Failed to fetch plugin' });
  }
});

// Create new plugin
router.post('/', async (req, res) => {
  try {
    const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);
    const userRepository = PublisherDataSource.getRepository(PublisherUser);
    
    // For now, we'll use a default user (in a real app, this would come from authentication)
    let author = await userRepository.findOne({ where: { email: 'admin@example.com' } });
    
    if (!author) {
      // Create default user if not exists
      author = userRepository.create({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN'
      });
      author = await userRepository.save(author);
    }
    
    const plugin = pluginRepository.create({
      ...req.body,
      authorId: author.id,
      status: PublisherPluginStatus.PENDING
    });
    
    const savedPlugin = await pluginRepository.save(plugin);
    
    // Fetch the plugin with author relation
    const result = await pluginRepository.findOne({
      where: { id: savedPlugin.id },
      relations: ['author']
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating plugin:', error);
    res.status(500).json({ error: 'Failed to create plugin' });
  }
});

// Update plugin
router.put('/:id', async (req, res) => {
  try {
    const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);
    const plugin = await pluginRepository.findOne({ where: { id: req.params.id } });
    
    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }
    
    Object.assign(plugin, req.body);
    const updatedPlugin = await pluginRepository.save(plugin);
    
    res.json(updatedPlugin);
  } catch (error) {
    console.error('Error updating plugin:', error);
    res.status(500).json({ error: 'Failed to update plugin' });
  }
});

// Update plugin status
router.patch('/:id/status', async (req, res) => {
  try {
    const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);
    const plugin = await pluginRepository.findOne({ where: { id: req.params.id } });
    
    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }
    
    const { status } = req.body;
    plugin.status = status;
    
    if (status === PublisherPluginStatus.APPROVED) {
      plugin.approvedAt = new Date();
    } else if (status === PublisherPluginStatus.REJECTED) {
      plugin.rejectedAt = new Date();
    }
    
    const updatedPlugin = await pluginRepository.save(plugin);
    
    res.json(updatedPlugin);
  } catch (error) {
    console.error('Error updating plugin status:', error);
    res.status(500).json({ error: 'Failed to update plugin status' });
  }
});

// Delete plugin
router.delete('/:id', async (req, res) => {
  try {
    const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);
    const plugin = await pluginRepository.findOne({ where: { id: req.params.id } });
    
    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }
    
    await pluginRepository.remove(plugin);
    res.json({ message: 'Plugin deleted successfully' });
  } catch (error) {
    console.error('Error deleting plugin:', error);
    res.status(500).json({ error: 'Failed to delete plugin' });
  }
});

// Get plugins by status
router.get('/status/:status', async (req, res) => {
  try {
    const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);
    const plugins = await pluginRepository.find({
      where: { status: req.params.status as PublisherPluginStatus },
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
    res.json(plugins);
  } catch (error) {
    console.error('Error fetching plugins by status:', error);
    res.status(500).json({ error: 'Failed to fetch plugins by status' });
  }
});

// Upload plugin
router.post('/upload', (req, res) => {
  res.json({ message: 'Upload plugin endpoint' });
});

export default router;