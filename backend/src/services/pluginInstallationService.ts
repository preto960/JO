import { AppDataSource } from '../config/database';
import { InstalledPlugin, InstallationStatus } from '../models/InstalledPlugin';
import { publisherService } from './publisherService';
import { pluginLifecycleService } from './pluginLifecycleService';
import { pluginLoaderService } from './pluginLoaderService';
import { pluginDatabaseService } from './pluginDatabaseService';
import { put } from '@vercel/blob';

export class PluginInstallationService {
  private installedPluginRepo = AppDataSource.getRepository(InstalledPlugin);

  /**
   * Instala un plugin desde Publisher
   */
  async installPlugin(publisherPluginId: string, userId?: string) {
    try {
      // 1. Verificar si ya está instalado
      const existing = await this.installedPluginRepo.findOne({
        where: { publisherPluginId }
      });

      if (existing) {
        throw new Error('Plugin already installed');
      }

      // 2. Obtener información del plugin desde Publisher
      const pluginData = await publisherService.getPluginById(publisherPluginId);

      // 3. Crear registro de instalación
      const installedPlugin = this.installedPluginRepo.create({
        publisherPluginId,
        name: pluginData.name,
        slug: pluginData.slug,
        version: pluginData.version,
        description: pluginData.description,
        manifest: pluginData.manifest,
        status: InstallationStatus.INSTALLING,
        installedBy: userId,
        packageUrl: pluginData.packageUrl // URL del blob en Publisher
      });

      await this.installedPluginRepo.save(installedPlugin);

      // 4. Descargar y extraer el plugin
      try {
        console.log(`📦 Loading plugin ${installedPlugin.name}...`);
        await pluginLoaderService.loadPlugin(installedPlugin);

        // 5. Crear tablas de base de datos si el plugin las necesita
        const pluginDir = pluginLoaderService.getPluginDirectory(installedPlugin.id);
        if (pluginDir) {
          await pluginDatabaseService.createPluginTables(installedPlugin, pluginDir);
        }

        installedPlugin.status = InstallationStatus.INSTALLED;
        installedPlugin.isActive = true;
        installedPlugin.lastActivatedAt = new Date();

        // 6. Ejecutar lifecycle hooks
        await pluginLifecycleService.executeOnInstall(installedPlugin);
        await pluginLifecycleService.executeOnActivate(installedPlugin);
      } catch (error: any) {
        installedPlugin.status = InstallationStatus.FAILED;
        installedPlugin.errorMessage = error.message;
        console.error('Installation error:', error);
      }

      await this.installedPluginRepo.save(installedPlugin);
      return installedPlugin;
    } catch (error: any) {
      console.error('Error installing plugin:', error.message);
      throw error;
    }
  }

  /**
   * Desinstala un plugin
   */
  async uninstallPlugin(pluginId: string) {
    const plugin = await this.installedPluginRepo.findOne({
      where: { id: pluginId }
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    plugin.status = InstallationStatus.UNINSTALLING;
    await this.installedPluginRepo.save(plugin);

    try {
      // Ejecutar lifecycle hooks
      await pluginLifecycleService.executeOnDeactivate(plugin);
      await pluginLifecycleService.executeOnUninstall(plugin);

      // Eliminar tablas de la base de datos
      await pluginDatabaseService.dropPluginTables(plugin);

      // Descargar el plugin
      await pluginLoaderService.unloadPlugin(plugin);
    } catch (error: any) {
      console.error('Error during uninstall:', error);
      // Continuar con la desinstalación aunque fallen algunos pasos
    }
    
    await this.installedPluginRepo.remove(plugin);
    return { message: 'Plugin uninstalled successfully' };
  }

  /**
   * Activa/Desactiva un plugin
   */
  async togglePlugin(pluginId: string, isActive: boolean) {
    const plugin = await this.installedPluginRepo.findOne({
      where: { id: pluginId }
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    try {
      if (isActive) {
        // Activar plugin
        await pluginLifecycleService.executeOnActivate(plugin);
        plugin.lastActivatedAt = new Date();
      } else {
        // Desactivar plugin
        await pluginLifecycleService.executeOnDeactivate(plugin);
      }

      plugin.isActive = isActive;
      await this.installedPluginRepo.save(plugin);
      
      return plugin;
    } catch (error: any) {
      throw new Error(`Failed to ${isActive ? 'activate' : 'deactivate'} plugin: ${error.message}`);
    }
  }

  /**
   * Actualiza un plugin instalado
   */
  async updatePlugin(pluginId: string) {
    const plugin = await this.installedPluginRepo.findOne({
      where: { id: pluginId }
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    const previousVersion = plugin.version;
    plugin.status = InstallationStatus.UPDATING;
    await this.installedPluginRepo.save(plugin);

    try {
      // Obtener la última versión desde Publisher
      const latestVersion = await publisherService.getPluginById(plugin.publisherPluginId);

      if (latestVersion.version === plugin.version) {
        plugin.status = InstallationStatus.INSTALLED;
        await this.installedPluginRepo.save(plugin);
        return { message: 'Plugin is already up to date', plugin };
      }

      // Actualizar información
      plugin.version = latestVersion.version;
      plugin.manifest = latestVersion.manifest;
      plugin.packageUrl = latestVersion.packageUrl;
      plugin.status = InstallationStatus.INSTALLED;

      // Ejecutar lifecycle hook de actualización
      await pluginLifecycleService.executeOnUpdate(plugin, previousVersion);

      await this.installedPluginRepo.save(plugin);
      return { message: 'Plugin updated successfully', plugin };
    } catch (error: any) {
      plugin.status = InstallationStatus.FAILED;
      plugin.errorMessage = error.message;
      await this.installedPluginRepo.save(plugin);
      throw error;
    }
  }

  /**
   * Obtiene todos los plugins instalados
   */
  async getInstalledPlugins(filters?: { isActive?: boolean }) {
    const where: any = {};
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return await this.installedPluginRepo.find({
      where,
      order: { installedAt: 'DESC' }
    });
  }

  /**
   * Obtiene un plugin instalado por ID
   */
  async getInstalledPlugin(pluginId: string) {
    const plugin = await this.installedPluginRepo.findOne({
      where: { id: pluginId }
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    return plugin;
  }

  /**
   * Actualiza la configuración de un plugin
   */
  async updatePluginConfig(pluginId: string, config: any) {
    const plugin = await this.installedPluginRepo.findOne({
      where: { id: pluginId }
    });

    if (!plugin) {
      throw new Error('Plugin not found');
    }

    plugin.config = config;
    await this.installedPluginRepo.save(plugin);
    return plugin;
  }
}

export const pluginInstallationService = new PluginInstallationService();

