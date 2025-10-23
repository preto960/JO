import axios from 'axios';
import { PublisherPlugin, PublisherPluginStatus } from '../entities/PublisherPlugin';

export class SyncService {
  private backendUrl: string;
  private apiKey: string;

  constructor() {
    this.backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    this.apiKey = process.env.BACKEND_API_KEY || 'your-api-key';
  }

  async syncApprovedPlugin(plugin: PublisherPlugin): Promise<boolean> {
    try {
      // Solo sincronizar plugins aprobados
      if (plugin.status !== PublisherPluginStatus.APPROVED) {
        console.log(`⏭️  Plugin ${plugin.title} no está aprobado, omitiendo sincronización`);
        return false;
      }

      console.log(`🔄 Sincronizando plugin: ${plugin.title}`);

      // Preparar datos para el backend principal
      const pluginData = {
        title: plugin.title,
        description: plugin.description,
        price: plugin.price || 0,
        category: plugin.category || 'general',
        tags: plugin.tags || [],
        downloadUrl: plugin.downloadUrl,
        demoUrl: plugin.demoUrl,
        githubUrl: plugin.githubUrl,
        documentationUrl: plugin.documentationUrl,
        authorId: plugin.authorId,
        status: 'approved' // Ya viene aprobado del publisher
      };

      // Enviar al backend principal
      const response = await axios.post(
        `${this.backendUrl}/api/plugins/sync`,
        pluginData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log(`✅ Plugin ${plugin.title} sincronizado correctamente`);
        return true;
      } else {
        console.error(`❌ Error sincronizando plugin ${plugin.title}:`, response.data);
        return false;
      }

    } catch (error: any) {
      console.error(`❌ Error sincronizando plugin ${plugin.title}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      return false;
    }
  }

  async syncAllApprovedPlugins(): Promise<void> {
    try {
      const { PublisherDataSource } = await import('../config/database');
      const pluginRepository = PublisherDataSource.getRepository(PublisherPlugin);

      const approvedPlugins = await pluginRepository.find({
        where: { status: PublisherPluginStatus.APPROVED }
      });

      console.log(`🔄 Sincronizando ${approvedPlugins.length} plugins aprobados...`);

      let successCount = 0;
      let failCount = 0;

      for (const plugin of approvedPlugins) {
        const success = await this.syncApprovedPlugin(plugin);
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      console.log(`📊 Sincronización completada: ${successCount} exitosos, ${failCount} fallidos`);

    } catch (error) {
      console.error('❌ Error en sincronización masiva:', error);
    }
  }

  async checkBackendConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.backendUrl}/api/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.error('❌ Backend no accesible:', error);
      return false;
    }
  }
}