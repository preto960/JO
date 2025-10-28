import { Request, Response } from 'express';
import { pluginInstallationService } from '../services/pluginInstallationService';
import { websocketService } from '../services/websocketService';
import { pluginLifecycleService } from '../services/pluginLifecycleService';
import { publisherService } from '../services/publisherService';

export class InstalledPluginController {
  /**
   * GET /api/installed-plugins
   * Obtiene todos los plugins instalados
   */
  async getInstalledPlugins(req: Request, res: Response) {
    try {
      const { isActive } = req.query;
      const filters: any = {};

      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      const plugins = await pluginInstallationService.getInstalledPlugins(filters);
      res.json(plugins);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/installed-plugins/:id
   * Obtiene un plugin instalado por ID
   */
  async getInstalledPlugin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plugin = await pluginInstallationService.getInstalledPlugin(id);
      res.json(plugin);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * POST /api/installed-plugins/install
   * Instala un plugin desde Publisher
   */
  async installPlugin(req: Request, res: Response) {
    try {
      const { publisherPluginId } = req.body;
      const userId = (req as any).user?.id;

      if (!publisherPluginId) {
        return res.status(400).json({ message: 'publisherPluginId is required' });
      }

      const plugin = await pluginInstallationService.installPlugin(publisherPluginId, userId);
      
      // Notificar a los clientes conectados
      websocketService.notifyPluginInstalled(
        plugin.id,
        plugin.slug,
        plugin.name
      );
      
      res.status(201).json(plugin);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * DELETE /api/installed-plugins/:id
   * Desinstala un plugin
   */
  async uninstallPlugin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Obtener info del plugin antes de desinstalar
      const plugin = await pluginInstallationService.getInstalledPlugin(id);
      
      const result = await pluginInstallationService.uninstallPlugin(id);
      
      // Notificar a los clientes conectados
      if (plugin) {
        websocketService.notifyPluginUninstalled(
          plugin.id,
          plugin.slug,
          plugin.name
        );
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * PATCH /api/installed-plugins/:id/toggle
   * Activa/Desactiva un plugin
   */
  async togglePlugin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (isActive === undefined) {
        return res.status(400).json({ message: 'isActive is required' });
      }

      const plugin = await pluginInstallationService.togglePlugin(id, isActive);
      
      // Notificar a los clientes conectados
      websocketService.notifyPluginToggled(
        plugin.id,
        plugin.slug,
        plugin.name,
        plugin.isActive
      );
      
      res.json(plugin);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * POST /api/installed-plugins/:id/update
   * Actualiza un plugin a la última versión
   */
  async updatePlugin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Obtener versión anterior
      const oldPlugin = await pluginInstallationService.getInstalledPlugin(id);
      const oldVersion = oldPlugin?.version || 'unknown';
      
      const result = await pluginInstallationService.updatePlugin(id);
      
      // Notificar a los clientes conectados
      if (result.plugin) {
        websocketService.notifyPluginUpdated(
          result.plugin.id,
          result.plugin.slug,
          result.plugin.name,
          oldVersion,
          result.plugin.version
        );
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * PATCH /api/installed-plugins/:id/config
   * Actualiza la configuración de un plugin
   */
  async updatePluginConfig(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { config } = req.body;

      if (!config) {
        return res.status(400).json({ message: 'config is required' });
      }

      const plugin = await pluginInstallationService.updatePluginConfig(id, config);
      res.json(plugin);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * GET /api/installed-plugins/loaded
   * Obtiene el estado de plugins cargados en memoria
   */
  async getLoadedPlugins(req: Request, res: Response) {
    try {
      const loadedPlugins = pluginLifecycleService.getLoadedPlugins();
      const pluginsArray = Array.from(loadedPlugins.entries()).map(([id, plugin]) => ({
        id,
        ...plugin
      }));
      res.json({ loadedPlugins: pluginsArray });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/market/plugins
   * Proxy a Publisher para obtener plugins disponibles
   */
  async getMarketPlugins(req: Request, res: Response) {
    try {
      const { search, category, minPrice, maxPrice, page, limit } = req.query;
      
      const filters: any = {};
      if (search) filters.search = search;
      if (category) filters.category = category;
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      if (page) filters.page = Number(page);
      if (limit) filters.limit = Number(limit);

      const plugins = await publisherService.getAvailablePlugins(filters);
      res.json(plugins);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * GET /api/market/plugins/:id
   * Proxy a Publisher para obtener un plugin específico
   */
  async getMarketPlugin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plugin = await publisherService.getPluginById(id);
      res.json(plugin);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}

export const installedPluginController = new InstalledPluginController();

