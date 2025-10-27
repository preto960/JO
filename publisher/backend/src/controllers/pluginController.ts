import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { PublishedPlugin, PluginStatus } from '../models/PublishedPlugin';
import { Developer } from '../models/Developer';
import { blobService } from '../services/blobService';

interface AuthRequest extends Request {
  user?: Developer;
}

export class PluginController {
  private pluginRepository = AppDataSource.getRepository(PublishedPlugin);

  // Public: Get all published plugins
  getPlugins = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 20, category, search, status = PluginStatus.PUBLISHED } = req.query;

      const queryBuilder = this.pluginRepository
        .createQueryBuilder('plugin')
        .leftJoinAndSelect('plugin.developer', 'developer')
        .where('plugin.status = :status', { status })
        .andWhere('plugin.isPublic = :isPublic', { isPublic: true });

      if (category) {
        queryBuilder.andWhere('plugin.category = :category', { category });
      }

      if (search) {
        queryBuilder.andWhere(
          '(plugin.name ILIKE :search OR plugin.description ILIKE :search OR plugin.tags::text ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      const [plugins, total] = await queryBuilder
        .orderBy('plugin.downloadCount', 'DESC')
        .skip((Number(page) - 1) * Number(limit))
        .take(Number(limit))
        .getManyAndCount();

      // Remove password from developer
      const pluginsWithoutPassword = plugins.map(plugin => ({
        ...plugin,
        developer: plugin.developer ? {
          ...plugin.developer,
          password: undefined
        } : undefined
      }));

      res.json({
        plugins: pluginsWithoutPassword,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get plugins error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Public: Get single plugin
  getPlugin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const plugin = await this.pluginRepository.findOne({
        where: { id, isPublic: true },
        relations: ['developer']
      });

      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      // Remove password from developer
      const pluginWithoutPassword = {
        ...plugin,
        developer: plugin.developer ? {
          ...plugin.developer,
          password: undefined
        } : undefined
      };

      res.json(pluginWithoutPassword);
    } catch (error) {
      console.error('Get plugin error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Protected: Get developer's plugins
  getMyPlugins = async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const developerId = req.user!.id;

      const queryBuilder = this.pluginRepository
        .createQueryBuilder('plugin')
        .where('plugin.developerId = :developerId', { developerId });

      if (status) {
        queryBuilder.andWhere('plugin.status = :status', { status });
      }

      const [plugins, total] = await queryBuilder
        .orderBy('plugin.updatedAt', 'DESC')
        .skip((Number(page) - 1) * Number(limit))
        .take(Number(limit))
        .getManyAndCount();

      res.json({
        plugins,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Get my plugins error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Protected: Create plugin
  createPlugin = async (req: AuthRequest, res: Response) => {
    try {
      const pluginData = req.body;
      const developerId = req.user!.id;

      // Generate slug from name
      const slug = pluginData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const plugin = this.pluginRepository.create({
        ...pluginData,
        slug,
        developer: { id: developerId } as Developer
      });

      await this.pluginRepository.save(plugin);

      res.status(201).json({
        message: 'Plugin created successfully',
        plugin
      });
    } catch (error) {
      console.error('Create plugin error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Protected: Update plugin
  updatePlugin = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const developerId = req.user!.id;

      const plugin = await this.pluginRepository.findOne({
        where: { id },
        relations: ['developer']
      });

      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      if (plugin.developer.id !== developerId && req.user!.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not authorized to update this plugin' });
      }

      Object.assign(plugin, updateData);
      await this.pluginRepository.save(plugin);

      res.json({
        message: 'Plugin updated successfully',
        plugin
      });
    } catch (error) {
      console.error('Update plugin error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Protected: Delete plugin
  deletePlugin = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const developerId = req.user!.id;

      const plugin = await this.pluginRepository.findOne({
        where: { id },
        relations: ['developer']
      });

      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      if (plugin.developer.id !== developerId && req.user!.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not authorized to delete this plugin' });
      }

      // Delete from blob storage if exists
      if (plugin.packageUrl) {
        try {
          await blobService.deletePlugin(plugin.packageUrl);
        } catch (error) {
          console.error('Failed to delete from blob storage:', error);
        }
      }

      await this.pluginRepository.remove(plugin);

      res.json({ message: 'Plugin deleted successfully' });
    } catch (error) {
      console.error('Delete plugin error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Protected: Upload plugin package
  uploadPackage = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const developerId = req.user!.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const plugin = await this.pluginRepository.findOne({
        where: { id },
        relations: ['developer']
      });

      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      if (plugin.developer.id !== developerId && req.user!.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not authorized to upload package for this plugin' });
      }

      // Delete old package if exists
      if (plugin.packageUrl) {
        try {
          await blobService.deletePlugin(plugin.packageUrl);
        } catch (error) {
          console.error('Failed to delete old package:', error);
        }
      }

      // Upload new package
      const { url, size } = await blobService.uploadPlugin(file, plugin.id, plugin.version);

      plugin.packageUrl = url;
      plugin.packageSize = size;
      await this.pluginRepository.save(plugin);

      res.json({
        message: 'Package uploaded successfully',
        packageUrl: url,
        packageSize: size
      });
    } catch (error) {
      console.error('Upload package error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Protected: Publish plugin
  publishPlugin = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const developerId = req.user!.id;

      const plugin = await this.pluginRepository.findOne({
        where: { id },
        relations: ['developer']
      });

      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      if (plugin.developer.id !== developerId && req.user!.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Not authorized to publish this plugin' });
      }

      if (!plugin.packageUrl) {
        return res.status(400).json({ message: 'Cannot publish plugin without package' });
      }

      plugin.status = PluginStatus.PUBLISHED;
      plugin.publishedAt = new Date();
      await this.pluginRepository.save(plugin);

      res.json({
        message: 'Plugin published successfully',
        plugin
      });
    } catch (error) {
      console.error('Publish plugin error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Public: Download plugin (for frontend system)
  downloadPlugin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const plugin = await this.pluginRepository.findOne({
        where: { id, status: PluginStatus.PUBLISHED, isPublic: true }
      });

      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      if (!plugin.packageUrl) {
        return res.status(404).json({ message: 'Plugin package not available' });
      }

      // Increment download count
      plugin.downloadCount += 1;
      await this.pluginRepository.save(plugin);

      // Return download URL
      res.json({
        downloadUrl: plugin.packageUrl,
        size: plugin.packageSize,
        version: plugin.version
      });
    } catch (error) {
      console.error('Download plugin error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

