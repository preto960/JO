import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Plugin, PluginStatus, PluginCategory } from '../models/Plugin';
import { User } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class PluginController {
  private pluginRepository = AppDataSource.getRepository(Plugin);

  getPlugins = async (req: Request, res: Response) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        category, 
        status = PluginStatus.APPROVED,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const queryBuilder = this.pluginRepository
        .createQueryBuilder('plugin')
        .leftJoinAndSelect('plugin.developer', 'developer')
        .leftJoinAndSelect('plugin.reviews', 'reviews')
        .where('plugin.status = :status', { status });

      if (category) {
        queryBuilder.andWhere('plugin.category = :category', { category });
      }

      if (search) {
        queryBuilder.andWhere(
          '(plugin.name ILIKE :search OR plugin.description ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      queryBuilder
        .orderBy(`plugin.${sortBy}`, sortOrder as 'ASC' | 'DESC')
        .skip((Number(page) - 1) * Number(limit))
        .take(Number(limit));

      const [plugins, total] = await queryBuilder.getManyAndCount();

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
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getPlugin = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const plugin = await this.pluginRepository
        .createQueryBuilder('plugin')
        .leftJoinAndSelect('plugin.developer', 'developer')
        .leftJoinAndSelect('plugin.reviews', 'reviews')
        .leftJoinAndSelect('reviews.user', 'user')
        .where('plugin.id = :id', { id })
        .getOne();

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      res.json({ plugin });
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('not found') ? 404 : 500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  createPlugin = async (req: AuthRequest, res: Response) => {
    try {
      const {
        name,
        description,
        longDescription,
        version,
        price,
        category,
        tags,
        documentationUrl,
        supportUrl,
        demoUrl,
        repositoryUrl
      } = req.body;

      // Generate slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Check if slug already exists
      const existingPlugin = await this.pluginRepository.findOne({ where: { slug } });
      if (existingPlugin) {
        throw createError('Plugin with this name already exists', 409);
      }

      const plugin = this.pluginRepository.create({
        name,
        slug,
        description,
        longDescription,
        version,
        price,
        category,
        tags,
        documentationUrl,
        supportUrl,
        demoUrl,
        repositoryUrl,
        developer: req.user!
      });

      await this.pluginRepository.save(plugin);

      res.status(201).json({
        message: 'Plugin created successfully',
        plugin
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('already exists') ? 409 : 500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updatePlugin = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const plugin = await this.pluginRepository.findOne({ 
        where: { id },
        relations: ['developer']
      });

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      // Check ownership
      if (plugin.developer.id !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw createError('Not authorized to update this plugin', 403);
      }

      // Update slug if name changed
      if (updates.name && updates.name !== plugin.name) {
        updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      Object.assign(plugin, updates);
      await this.pluginRepository.save(plugin);

      res.json({
        message: 'Plugin updated successfully',
        plugin
      });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('authorized') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  deletePlugin = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const plugin = await this.pluginRepository.findOne({ 
        where: { id },
        relations: ['developer']
      });

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      // Check ownership
      if (plugin.developer.id !== req.user!.id && req.user!.role !== 'ADMIN') {
        throw createError('Not authorized to delete this plugin', 403);
      }

      await this.pluginRepository.remove(plugin);

      res.json({ message: 'Plugin deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('authorized') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getMyPlugins = async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 20, status } = req.query;

      const queryBuilder = this.pluginRepository
        .createQueryBuilder('plugin')
        .where('plugin.developerId = :developerId', { developerId: req.user!.id });

      if (status) {
        queryBuilder.andWhere('plugin.status = :status', { status });
      }

      queryBuilder
        .orderBy('plugin.createdAt', 'DESC')
        .skip((Number(page) - 1) * Number(limit))
        .take(Number(limit));

      const [plugins, total] = await queryBuilder.getManyAndCount();

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
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  submitForReview = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const plugin = await this.pluginRepository.findOne({ 
        where: { id },
        relations: ['developer']
      });

      if (!plugin) {
        throw createError('Plugin not found', 404);
      }

      // Check ownership
      if (plugin.developer.id !== req.user!.id) {
        throw createError('Not authorized to submit this plugin', 403);
      }

      plugin.status = PluginStatus.PENDING;
      await this.pluginRepository.save(plugin);

      res.json({
        message: 'Plugin submitted for review',
        plugin
      });
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('authorized') ? 403 : 500;
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
}