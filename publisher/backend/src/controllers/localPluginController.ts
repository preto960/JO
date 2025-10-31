import { Request, Response } from 'express';
import { pluginFileService } from '../services/pluginFileService';
import { pluginBuildService } from '../services/pluginBuildService';
import { AppDataSource } from '../config/database';
import { PublishedPlugin, PluginStatus } from '../models/PublishedPlugin';
import { Developer } from '../models/Developer';

interface AuthRequest extends Request {
  user?: Developer;
}

export class LocalPluginController {
  private pluginRepository = AppDataSource.getRepository(PublishedPlugin);

  /**
   * GET /api/local-plugins
   * Detecta y lista todos los plugins locales
   */
  detectLocalPlugins = async (req: Request, res: Response) => {
    try {
      const plugins = await pluginFileService.detectPlugins();
      
      res.json({
        plugins,
        count: plugins.length,
        pluginsDirectory: pluginFileService.getPluginsDirectory()
      });
    } catch (error: any) {
      console.error('Error detecting plugins:', error);
      res.status(500).json({ message: 'Failed to detect plugins', error: error.message });
    }
  };

  /**
   * GET /api/local-plugins/:slug
   * Obtiene detalles de un plugin local específico
   */
  getLocalPlugin = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      
      const plugins = await pluginFileService.detectPlugins();
      const plugin = plugins.find(p => p.manifest.slug === slug);
      
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }
      
      res.json(plugin);
    } catch (error: any) {
      console.error('Error getting plugin:', error);
      res.status(500).json({ message: 'Failed to get plugin', error: error.message });
    }
  };

  /**
   * POST /api/local-plugins/:slug/build
   * Construye y empaqueta un plugin local
   */
  buildPlugin = async (req: AuthRequest, res: Response) => {
    try {
      const { slug } = req.params;
      const developerId = req.user!.id;
      
      // Detectar el plugin
      const plugins = await pluginFileService.detectPlugins();
      const plugin = plugins.find(p => p.manifest.slug === slug);
      
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }
      
      if (!plugin.isValid) {
        return res.status(400).json({ 
          message: 'Plugin is not valid', 
          errors: plugin.errors 
        });
      }
      
      // Construir el plugin
      const buildResult = await pluginBuildService.buildPlugin(plugin, developerId);
      
      if (!buildResult.success) {
        return res.status(500).json({ 
          message: 'Build failed', 
          errors: buildResult.errors 
        });
      }
      
      res.json({
        message: 'Plugin built successfully',
        result: buildResult
      });
    } catch (error: any) {
      console.error('Error building plugin:', error);
      res.status(500).json({ message: 'Failed to build plugin', error: error.message });
    }
  };

  /**
   * POST /api/local-plugins/:slug/build-and-publish
   * Construye, empaqueta y publica un plugin en un solo paso
   */
  buildAndPublish = async (req: AuthRequest, res: Response) => {
    try {
      const { slug } = req.params;
      const developerId = req.user!.id;
      
      // 1. Detectar el plugin
      const plugins = await pluginFileService.detectPlugins();
      const plugin = plugins.find(p => p.manifest.slug === slug);
      
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }
      
      if (!plugin.isValid) {
        return res.status(400).json({ 
          message: 'Plugin is not valid', 
          errors: plugin.errors 
        });
      }
      
      // 2. Construir el plugin
      console.log(`🚀 Building and publishing plugin: ${plugin.manifest.name}`);
      const buildResult = await pluginBuildService.buildPlugin(plugin, developerId);
      
      if (!buildResult.success) {
        return res.status(500).json({ 
          message: 'Build failed', 
          errors: buildResult.errors 
        });
      }
      
      // 3. Buscar si ya existe un plugin publicado con este slug
      let publishedPlugin = await this.pluginRepository.findOne({
        where: { slug, developer: { id: developerId } },
        relations: ['developer']
      });
      
      if (publishedPlugin) {
        // Actualizar plugin existente
        publishedPlugin.version = plugin.manifest.version;
        publishedPlugin.name = plugin.manifest.name;
        publishedPlugin.description = plugin.manifest.description;
        publishedPlugin.longDescription = plugin.manifest.longDescription;
        publishedPlugin.packageUrl = buildResult.blobUrl!;
        publishedPlugin.manifest = plugin.manifest;
        publishedPlugin.tags = plugin.manifest.tags;
        publishedPlugin.status = PluginStatus.PUBLISHED;
        publishedPlugin.isPublic = true;
        publishedPlugin.publishedAt = new Date();
        
        console.log(`📝 Updating existing plugin: ${publishedPlugin.name}`);
      } else {
        // Crear nuevo plugin
        const developer = await AppDataSource.getRepository(Developer).findOne({
          where: { id: developerId }
        });
        
        if (!developer) {
          return res.status(404).json({ message: 'Developer not found' });
        }
        
        publishedPlugin = this.pluginRepository.create({
          name: plugin.manifest.name,
          slug: plugin.manifest.slug,
          description: plugin.manifest.description,
          longDescription: plugin.manifest.longDescription,
          version: plugin.manifest.version,
          packageUrl: buildResult.blobUrl!,
          manifest: plugin.manifest,
          category: plugin.manifest.category as any,
          tags: plugin.manifest.tags,
          status: PluginStatus.PUBLISHED,
          isPublic: true,
          publishedAt: new Date(),
          developer
        });
        
        console.log(`✨ Creating new plugin: ${publishedPlugin.name}`);
      }
      
      await this.pluginRepository.save(publishedPlugin);
      
      console.log(`✅ Plugin published successfully: ${publishedPlugin.name}`);
      
      res.json({
        message: 'Plugin built and published successfully',
        plugin: {
          id: publishedPlugin.id,
          name: publishedPlugin.name,
          slug: publishedPlugin.slug,
          version: publishedPlugin.version,
          status: publishedPlugin.status
        },
        buildResult: {
          blobUrl: buildResult.blobUrl,
          size: buildResult.size,
          checksum: buildResult.checksum
        }
      });
    } catch (error: any) {
      console.error('Error building and publishing plugin:', error);
      res.status(500).json({ message: 'Failed to build and publish plugin', error: error.message });
    }
  };

  /**
   * POST /api/local-plugins/:slug/sandbox
   * Construye el plugin para testing en sandbox
   */
  buildForSandbox = async (req: AuthRequest, res: Response) => {
    try {
      const { slug } = req.params;
      const developerId = req.user!.id;
      
      const plugins = await pluginFileService.detectPlugins();
      const plugin = plugins.find(p => p.manifest.slug === slug);
      
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }
      
      if (!plugin.isValid) {
        return res.status(400).json({ 
          message: 'Plugin is not valid', 
          errors: plugin.errors 
        });
      }
      
      const buildResult = await pluginBuildService.buildForSandbox(plugin, developerId);
      
      if (!buildResult.success) {
        return res.status(500).json({ 
          message: 'Sandbox build failed', 
          errors: buildResult.errors 
        });
      }
      
      res.json({
        message: 'Plugin built for sandbox successfully',
        result: buildResult,
        sandboxUrl: buildResult.blobUrl
      });
    } catch (error: any) {
      console.error('Error building for sandbox:', error);
      res.status(500).json({ message: 'Failed to build for sandbox', error: error.message });
    }
  };
}

export const localPluginController = new LocalPluginController();



