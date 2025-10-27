import { AppDataSource } from '../config/database';
import { InstalledPlugin, InstallationStatus } from '../models/InstalledPlugin';
import { publisherService } from './publisherService';
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

      // 4. Descargar el paquete (opcional, si queremos una copia local)
      try {
        // Por ahora solo guardamos la referencia, no descargamos
        // Si necesitas descargar y almacenar localmente:
        // const packageBuffer = await publisherService.downloadPluginPackage(publisherPluginId);
        // const blob = await put(`plugins/${installedPlugin.slug}-${installedPlugin.version}.zip`, packageBuffer, {
        //   access: 'public',
        // });
        // installedPlugin.packageUrl = blob.url;

        installedPlugin.status = InstallationStatus.INSTALLED;
        installedPlugin.isActive = true;
        installedPlugin.lastActivatedAt = new Date();
      } catch (error: any) {
        installedPlugin.status = InstallationStatus.FAILED;
        installedPlugin.errorMessage = error.message;
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

    // Aquí podrías agregar lógica para limpiar recursos, archivos, etc.
    
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

    plugin.isActive = isActive;
    if (isActive) {
      plugin.lastActivatedAt = new Date();
    }

    await this.installedPluginRepo.save(plugin);
    return plugin;
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

